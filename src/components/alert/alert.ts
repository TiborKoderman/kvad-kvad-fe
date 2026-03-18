import { useAlertStore } from '@/stores/alerts'
import { themeVariants, type ThemeVariant } from '@/assets/themes/theme-config'

export type ActionHandler = () => void | Promise<unknown>

export interface ActionConfig {
  handler: ActionHandler
  label?: string
  variant?: ThemeVariant
  outline?: boolean
}

export type AlertAction = ActionHandler | ActionConfig

export interface AlertActions {
  ok?: AlertAction
  cancel?: AlertAction
  confirm?: AlertAction
  close?: AlertAction
  [key: string]: AlertAction | undefined
}

export interface ActionButton {
  key: string
  label: string
  handler: ActionHandler
  variant?: ThemeVariant
  outline?: boolean
}

export interface AlertConfig {
  message: string
  description?: string
  icon?: string | boolean
  color?: string
  variant?: ThemeVariant
  actions?: AlertActions
  onAction?: (actionKey: string, value?: any) => void
}

export interface AlertProps {
  title?: string
  message: string
  kind?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

// Base Alert class with core functionality
class AlertClass {
  /**
   * Open a custom alert with full configuration
   * Supports multiple signatures:
   * - Alert.open(config: AlertConfig)
   * - Alert.open(message: string, actions?: AlertActions)
   * - Alert.open(icon: string, color: string, message: string, actions?: AlertActions)
   */
  static open(
    configOrIconOrMessage: string | AlertConfig,
    colorOrActions?: string | AlertActions,
    messageOrActions?: string | AlertActions,
    actions?: AlertActions
  ): Promise<any> {
    const alertStore = useAlertStore()

    let config: AlertConfig

    // Handle different signatures
    if (typeof configOrIconOrMessage === 'object' && configOrIconOrMessage !== null) {
      // Full config object
      config = configOrIconOrMessage
    } else if (typeof configOrIconOrMessage === 'string') {
      // Check which signature this is
      if (typeof colorOrActions === 'string' && typeof messageOrActions === 'string') {
        // Alert.open(icon, color, message, actions)
        config = {
          icon: configOrIconOrMessage,
          color: colorOrActions,
          message: messageOrActions,
          actions: actions
        }
      } else if (typeof colorOrActions === 'object') {
        // Alert.open(message, actions)
        config = {
          message: configOrIconOrMessage,
          actions: colorOrActions as AlertActions
        }
      } else {
        // Alert.open(message)
        config = {
          message: configOrIconOrMessage
        }
      }
    } else {
      throw new Error('Invalid Alert.open() arguments')
    }

    return alertStore.open(config)
  }

  /**
   * Show a confirmation dialog (promise resolves on OK, rejects on Cancel)
   */
  static confirm(message: string, description?: string): Promise<boolean> {
    const alertStore = useAlertStore()
    return alertStore.open({
      message,
      description,
      variant: 'primary',
      actions: {
        confirm: () => true,
        cancel: () => false
      }
    })
  }
}

// Create variant method factory
function createVariantMethod(variant: ThemeVariant) {
  return function(
    message: string,
    descriptionOrActions?: string | AlertActions,
    actions?: AlertActions
  ): Promise<any> {
    const alertStore = useAlertStore()

    let description: string | undefined
    let finalActions: AlertActions | undefined

    if (typeof descriptionOrActions === 'string') {
      description = descriptionOrActions
      finalActions = actions
    } else {
      finalActions = descriptionOrActions
    }

    return alertStore.open({
      message,
      description,
      variant,
      actions: finalActions
    })
  }
}

// Auto-generate variant methods dynamically
const Alert = AlertClass as typeof AlertClass & Record<ThemeVariant | 'error', ReturnType<typeof createVariantMethod>>

// Generate methods for all theme variants
themeVariants.forEach(variant => {
  (Alert as any)[variant] = createVariantMethod(variant)
})

// Add error as alias for danger
;(Alert as any).error = createVariantMethod('danger')

export { Alert }

// Export for backward compatibility
export class AlertBuilder {
  constructor() {}

  static showAlert(message: string): void {
    Alert.info(message)
  }

  add(props: AlertProps): AlertBuilder {
    const variant = props.kind || 'info'
    Alert[variant](props.message)
    return this
  }
}
