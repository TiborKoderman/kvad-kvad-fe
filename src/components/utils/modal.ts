import {
  createApp,
  h,
  ref,
  isRef,
  computed,
  provide,
  type Component,
  type ComponentPublicInstance,
} from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import type { ThemeVariant } from '@/assets/themes/theme-config'
import {
  modalRuntimeKey,
  useModal,
  type ModalActionContext,
  type ModalLifecycleHandler,
  type ModalModel,
  type ModalRuntime,
} from '@/composables/modal'

export { useModal }
export type { ModalActionContext, ModalLifecycleHandler, ModalModel }

export interface ModalActionConfig<T = unknown, TModel = unknown> {
  handler?: ModalLifecycleHandler<T, TModel>
  label?: string
  variant?: ThemeVariant
  outline?: boolean
  closeOnSuccess?: boolean
}

export type ModalAction<T = unknown, TModel = unknown> =
  | ModalLifecycleHandler<T, TModel>
  | ModalActionConfig<T, TModel>

export interface ModalActions<T = unknown, TModel = unknown> {
  ok?: ModalAction<T, TModel>
  save?: ModalAction<T, TModel>
  submit?: ModalAction<T, TModel>
  confirm?: ModalAction<T, TModel>
  close?: ModalAction<T, TModel>
  cancel?: ModalAction<T, TModel>
  [key: string]: ModalAction<T, TModel> | undefined
}

export interface ModalOptions<T = unknown, TModel = unknown> {
  title?: string
  props?: Record<string, unknown>
  model?: ModalModel<TModel>
  actions?: ModalActions<T, TModel>
  fullscreen?: boolean
  closeOnBackdrop?: boolean
}

interface NormalizedModalAction<T = unknown, TModel = unknown>
  extends ModalFooterActionButton {
  handler?: ModalLifecycleHandler<T, TModel>
  closeOnSuccess: boolean
}

interface ModalFooterActionButton {
  key: string
  label: string
  variant?: ThemeVariant
  outline?: boolean
}

interface ModalComponentInstance extends ComponentPublicInstance {
  [key: string]: unknown
}

interface HandlerMatch<T = unknown, TModel = unknown> {
  key: string
  handlers: ModalLifecycleHandler<T, TModel>[]
}

interface ExposedHandlerMatch<T = unknown, TModel = unknown> {
  key: string
  handler: ModalLifecycleHandler<T, TModel>
}

interface RunActionOptions {
  skipInternal?: boolean
  initialResult?: unknown
}

const submitActionKeys = ['ok', 'save', 'submit', 'confirm'] as const
const closeActionKeys = ['close', 'cancel'] as const
const submitAliasPriority = ['submit', 'save', 'ok', 'confirm'] as const

const isSubmitActionKey = (key: string) =>
  submitActionKeys.includes(key as (typeof submitActionKeys)[number])
const isCloseActionKey = (key: string) =>
  closeActionKeys.includes(key as (typeof closeActionKeys)[number])

const humanizeActionKey = (key: string) => {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, char => char.toUpperCase())
}

const getDefaultActionLabel = (key: string) => {
  switch (key) {
    case 'ok':
      return 'OK'
    case 'save':
      return 'Save'
    case 'submit':
      return 'Submit'
    case 'confirm':
      return 'Confirm'
    case 'close':
      return 'Close'
    case 'cancel':
      return 'Cancel'
    default:
      return humanizeActionKey(key)
  }
}

const getDefaultActionVariant = (key: string): ThemeVariant => {
  if (isSubmitActionKey(key) || /save|apply|create|update|publish/i.test(key)) {
    return 'primary'
  }

  if (/delete|remove|destroy/i.test(key)) {
    return 'danger'
  }

  return 'dark'
}

const getDefaultActionOutline = (key: string) => {
  return !isSubmitActionKey(key) && !/delete|remove|destroy/i.test(key)
}

const normalizeAction = <T = unknown, TModel = unknown>(
  key: string,
  action?: ModalAction<T, TModel>,
): NormalizedModalAction<T, TModel> => {
  if (typeof action === 'function') {
    return {
      key,
      label: getDefaultActionLabel(key),
      handler: action,
      variant: getDefaultActionVariant(key),
      outline: getDefaultActionOutline(key),
      closeOnSuccess: true,
    }
  }

  return {
    key,
    label: action?.label || getDefaultActionLabel(key),
    handler: action?.handler,
    variant: action?.variant || getDefaultActionVariant(key),
    outline: action?.outline ?? getDefaultActionOutline(key),
    closeOnSuccess: action?.closeOnSuccess ?? true,
  }
}

const isModalOptions = <T = unknown, TModel = unknown>(
  value: unknown,
): value is ModalOptions<T, TModel> => {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    isRef(value)
  ) {
    return false
  }

  return [
    'title',
    'props',
    'model',
    'actions',
    'fullscreen',
    'closeOnBackdrop',
  ].some(key => key in value)
}

const getActionAliases = (actionKey: string) => {
  if (isSubmitActionKey(actionKey)) {
    return [actionKey, ...submitAliasPriority.filter(key => key !== actionKey)]
  }

  if (isCloseActionKey(actionKey)) {
    return [actionKey, ...closeActionKeys.filter(key => key !== actionKey)]
  }

  return [actionKey]
}

const getComponentDefaults = (
  component: Component,
  props: Record<string, unknown>,
): Partial<Pick<ModalOptions, 'title' | 'fullscreen'>> => {
  const componentWithDefaults = component as Component & {
    baseProps?: (props: Record<string, unknown>) => Record<string, unknown>
  }

  const baseProps = componentWithDefaults.baseProps?.(props)

  return {
    title: typeof baseProps?.title === 'string' ? baseProps.title : undefined,
    fullscreen:
      typeof baseProps?.fullscreen === 'boolean'
        ? baseProps.fullscreen
        : undefined,
  }
}

const buildComponentProps = <TModel = unknown>(
  modalRef: { value: ModalComponentInstance | null },
  props: Record<string, unknown>,
  model?: ModalModel<TModel>,
  onClose?: (value?: unknown) => void,
  onSubmit?: (value?: unknown) => void,
) => {
  const componentProps: Record<string, unknown> = {
    ref: modalRef,
    ...props,
    onClose,
    onCancel: onClose,
    onSubmit,
    onSave: onSubmit,
    onOk: onSubmit,
    onConfirm: onSubmit,
  }

  if (model) {
    componentProps.modelValue = model.value
    componentProps['onUpdate:modelValue'] = (value: TModel) => {
      model.value = value
    }
  }

  return componentProps
}

const normalizeOpenOptions = <T = unknown, TModel = unknown>(
  component: Component,
  titleOrOptions?: string | ModalOptions<T, TModel>,
  props: Record<string, unknown> = {},
  modelOrActions?: ModalModel<TModel> | ModalActions<T, TModel>,
  actions?: ModalActions<T, TModel>,
) => {
  if (
    isModalOptions<T, TModel>(titleOrOptions) ||
    titleOrOptions === undefined
  ) {
    const options = (
      isModalOptions<T, TModel>(titleOrOptions) ? titleOrOptions : {}
    ) as ModalOptions<T, TModel>
    const componentProps = options.props ?? {}
    const componentDefaults = getComponentDefaults(component, componentProps)

    return {
      ...componentDefaults,
      fullscreen: true,
      closeOnBackdrop: true,
      ...options,
      title: options.title ?? componentDefaults.title ?? 'Modal',
      props: componentProps,
    } satisfies ModalOptions<T, TModel>
  }

  const model = isRef(modelOrActions) ? modelOrActions : undefined
  const finalActions = isRef(modelOrActions)
    ? actions
    : (modelOrActions as ModalActions<T, TModel> | undefined)
  const componentDefaults = getComponentDefaults(component, props)

  return {
    ...componentDefaults,
    title: titleOrOptions || componentDefaults.title || 'Modal',
    props,
    model,
    actions: finalActions,
    fullscreen: componentDefaults.fullscreen ?? true,
    closeOnBackdrop: true,
  } satisfies ModalOptions<T, TModel>
}

export class Modal {
  static open<T = unknown, TModel = unknown>(
    component: Component,
    options?: ModalOptions<T, TModel>,
  ): Promise<T | undefined>
  static open<T = unknown, TModel = unknown>(
    component: Component,
    title?: string,
    props?: Record<string, unknown>,
    model?: ModalModel<TModel> | ModalActions<T, TModel>,
    actions?: ModalActions<T, TModel>,
  ): Promise<T | undefined>
  static open<T = unknown, TModel = unknown>(
    component: Component,
    titleOrOptions?: string | ModalOptions<T, TModel>,
    props: Record<string, unknown> = {},
    modelOrActions?: ModalModel<TModel> | ModalActions<T, TModel>,
    actions?: ModalActions<T, TModel>,
  ): Promise<T | undefined> {
    const options = normalizeOpenOptions<T, TModel>(
      component,
      titleOrOptions,
      props,
      modelOrActions,
      actions,
    )

    return new Promise<T | undefined>(resolve => {
      const modalRef = ref<ModalComponentInstance | null>(null)
      const mountTarget = document.createElement('div')
      const registeredHandlers = new Map<
        string,
        Set<ModalLifecycleHandler<T, TModel>>
      >()
      const handlerVersion = ref(0)

      document.body.appendChild(mountTarget)

      const registerActionHandler = (
        actionKey: string,
        handler: ModalLifecycleHandler<T, TModel>,
      ) => {
        const handlers =
          registeredHandlers.get(actionKey) ??
          new Set<ModalLifecycleHandler<T, TModel>>()
        handlers.add(handler)
        registeredHandlers.set(actionKey, handlers)
        handlerVersion.value += 1

        return () => {
          handlers.delete(handler)

          if (handlers.size === 0) {
            registeredHandlers.delete(actionKey)
          }

          handlerVersion.value += 1
        }
      }

      const finalize = (value?: T) => {
        app.unmount()
        mountTarget.remove()
        resolve(value)
      }

      const getActionContext = (
        actionKey: string,
      ): ModalActionContext<T, TModel> => ({
        actionKey,
        modal: modalRef.value,
        model: options.model?.value,
        modelRef: options.model,
        props: options.props ?? {},
      })

      const runHandlers = async (
        handlers: ModalLifecycleHandler<T, TModel>[],
        context: ModalActionContext<T, TModel>,
      ) => {
        let result: unknown

        for (const handler of handlers) {
          const nextResult = await handler(context)

          if (nextResult === false) {
            return false
          }

          if (nextResult !== undefined) {
            result = nextResult
          }
        }

        return result
      }

      const findRegisteredHandlerMatch = (
        actionKey: string,
      ): HandlerMatch<T, TModel> | null => {
        void handlerVersion.value

        for (const alias of getActionAliases(actionKey)) {
          const handlers = registeredHandlers.get(alias)

          if (handlers && handlers.size > 0) {
            return {
              key: alias,
              handlers: Array.from(handlers),
            }
          }
        }

        return null
      }

      const findExposedHandlerMatch = (
        actionKey: string,
      ): ExposedHandlerMatch<T, TModel> | null => {
        const instance = modalRef.value

        if (!instance) {
          return null
        }

        for (const alias of getActionAliases(actionKey)) {
          const candidate = instance[alias]

          if (typeof candidate === 'function') {
            return {
              key: alias,
              handler: candidate as ModalLifecycleHandler<T, TModel>,
            }
          }
        }

        return null
      }

      const hasInternalActionTarget = (actionKey: string) => {
        return (
          !!findRegisteredHandlerMatch(actionKey) ||
          !!findExposedHandlerMatch(actionKey)
        )
      }

      const runInternalAction = async (
        actionKey: string,
        context: ModalActionContext<T, TModel>,
      ) => {
        const registeredMatch = findRegisteredHandlerMatch(actionKey)

        if (registeredMatch) {
          return runHandlers(registeredMatch.handlers, context)
        }

        const exposedMatch = findExposedHandlerMatch(actionKey)

        if (exposedMatch) {
          return await exposedMatch.handler.call(modalRef.value, context)
        }

        return undefined
      }

      const app = createApp({
        setup() {
          const normalizedActions = computed(() => {
            return Object.entries(options.actions ?? {}).map(([key, action]) =>
              normalizeAction<T, TModel>(key, action),
            )
          })

          const normalizedActionMap = computed(() => {
            return new Map(
              normalizedActions.value.map(action => [action.key, action]),
            )
          })

          const configuredFooterActions = computed(() => {
            return normalizedActions.value.filter(action => {
              if (isCloseActionKey(action.key)) {
                return false
              }

              return !!action.handler || hasInternalActionTarget(action.key)
            })
          })

          const autoSubmitAction = computed<NormalizedModalAction<
            T,
            TModel
          > | null>(() => {
            const hasConfiguredSubmitButton =
              configuredFooterActions.value.some(action =>
                isSubmitActionKey(action.key),
              )

            if (hasConfiguredSubmitButton || !hasInternalActionTarget('save')) {
              return null
            }

            return normalizeAction<T, TModel>('save')
          })

          const footerActions = computed(() => {
            return [
              ...configuredFooterActions.value,
              ...(autoSubmitAction.value ? [autoSubmitAction.value] : []),
            ]
          })

          const footerActionMap = computed(() => {
            return new Map(
              footerActions.value.map(action => [action.key, action]),
            )
          })

          const resolveActionConfig = (actionKey: string) => {
            if (footerActionMap.value.has(actionKey)) {
              return footerActionMap.value.get(actionKey)
            }

            if (normalizedActionMap.value.has(actionKey)) {
              return normalizedActionMap.value.get(actionKey)
            }

            if (isSubmitActionKey(actionKey)) {
              return footerActions.value.find(action =>
                isSubmitActionKey(action.key),
              )
            }

            if (isCloseActionKey(actionKey)) {
              return (
                normalizedActionMap.value.get('close') ||
                normalizedActionMap.value.get('cancel') ||
                normalizeAction<T, TModel>('close')
              )
            }

            return undefined
          }

          const footerButtons = computed<ModalFooterActionButton[]>(() => {
            return footerActions.value.map(
              ({ key, label, variant, outline }) => ({
                key,
                label,
                variant,
                outline,
              }),
            )
          })

          const runAction = async (
            actionKey: string,
            actionConfig = resolveActionConfig(actionKey),
            runOptions: RunActionOptions = {},
          ) => {
            const context = getActionContext(actionKey)
            let result = runOptions.initialResult

            try {
              if (!runOptions.skipInternal) {
                const internalResult = await runInternalAction(
                  actionKey,
                  context,
                )

                if (internalResult === false) {
                  return undefined
                }

                if (internalResult !== undefined) {
                  result = internalResult
                }
              }

              if (actionConfig?.handler) {
                const handlerResult = await actionConfig.handler(context)

                if (handlerResult === false) {
                  return undefined
                }

                if (handlerResult !== undefined) {
                  result = handlerResult
                }
              }

              if (actionConfig?.closeOnSuccess === false) {
                return result
              }

              finalize(result as T | undefined)
              return result
            } catch (error) {
              console.error(`Modal action "${actionKey}" failed:`, error)
              return undefined
            }
          }

          const runtime: ModalRuntime<T, TModel> = {
            modelRef: options.model,
            onAction: registerActionHandler,
            onClose: handler => registerActionHandler('close', handler),
            onSubmit: handler => registerActionHandler('submit', handler),
            onSave: handler => registerActionHandler('save', handler),
            requestClose: () => runAction('close'),
            requestSubmit: () => {
              const action =
                footerActions.value.find(candidate =>
                  isSubmitActionKey(candidate.key),
                ) ||
                autoSubmitAction.value ||
                normalizeAction<T, TModel>('save')

              return runAction(action.key, action)
            },
          }

          provide(modalRuntimeKey, runtime)

          return () =>
            h(
              BaseModal,
              {
                title: options.title,
                fullscreen: options.fullscreen,
                closeOnBackdrop: options.closeOnBackdrop,
                buttons: footerButtons.value,
                onClose: () => {
                  void runtime.requestClose()
                },
                onAction: (actionKey: string) => {
                  void runAction(actionKey)
                },
              },
              {
                default: () =>
                  h(
                    component,
                    buildComponentProps(
                      modalRef,
                      options.props ?? {},
                      options.model,
                      (value?: unknown) => {
                        void runAction('close', resolveActionConfig('close'), {
                          skipInternal: true,
                          initialResult: value,
                        })
                      },
                      (value?: unknown) => {
                        const action =
                          footerActions.value.find(candidate =>
                            isSubmitActionKey(candidate.key),
                          ) ||
                          autoSubmitAction.value ||
                          resolveActionConfig('save')

                        if (!action) {
                          finalize(value as T | undefined)
                          return
                        }

                        void runAction(action.key, action, {
                          skipInternal: true,
                          initialResult: value,
                        })
                      },
                    ),
                  ),
              },
            )
        },
      })

      app.mount(mountTarget)
    })
  }

  static openAuto<T = unknown, TModel = unknown>(
    component: Component,
    options?: ModalOptions<T, TModel>,
  ): Promise<T | undefined> {
    return Modal.open<T, TModel>(component, options)
  }

  static confirm<T = unknown, TModel = unknown>(
    component: Component,
    options: ModalOptions<T, TModel> = {},
  ): Promise<T | undefined> {
    return Modal.open<T, TModel>(component, {
      ...options,
      actions: {
        confirm: options.actions?.confirm ?? (() => true),
        ...options.actions,
      },
    })
  }

  static info<T = unknown, TModel = unknown>(
    component: Component,
    options: ModalOptions<T, TModel> = {},
  ): Promise<T | undefined> {
    return Modal.open<T, TModel>(component, options)
  }
}
