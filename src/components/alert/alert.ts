export class AlertBuilder {
  constructor() {}

  static showAlert(message: string): void {
    // Implementation for showing an alert with the given message
    console.log('Alert:', message)
  }

  add(props: AlertProps): AlertBuilder {
    // Implementation for adding alert properties
    console.log('Adding alert with props:', props)
    return this
  }
}

export class Alert {
  [key: string]: unknown
  constructor() {}
}

interface AlertProps {
  title?: string
  message: string
  kind?: 'success' | 'error' | 'warning' | 'info'
  duration?: number // in milliseconds
}

interface Buttons {
  label: string
  action: () => void
}

const defaultButtons: Buttons[] = [
  {
    label: 'OK',
    action: () => {
      console.log('OK clicked')
    },
  },
  {
    label: 'Cancel',
    action: () => {
      console.log('Cancel clicked')
    },
  },
]
