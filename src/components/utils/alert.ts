export class Alert {}

enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  CUSTOM = 'custom',
}

interface AlertArms {
  confirm?: () => unknown
  cancel?: () => unknown
  [key: string]: () => void
}
