import {
  inject,
  type ComponentPublicInstance,
  type InjectionKey,
  type Ref,
  type WritableComputedRef,
} from 'vue'

export type ModalModel<T = unknown> = Ref<T> | WritableComputedRef<T>

export interface ModalActionContext<T = unknown, TModel = unknown> {
  actionKey: string
  modal: ComponentPublicInstance | null
  model: TModel | undefined
  modelRef?: ModalModel<TModel>
  props: Record<string, unknown>
}

export type ModalLifecycleHandler<T = unknown, TModel = unknown> = (
  context: ModalActionContext<T, TModel>,
) => unknown | Promise<unknown>

export interface ModalRuntime<T = unknown, TModel = unknown> {
  modelRef?: ModalModel<TModel>
  onAction: (
    actionKey: string,
    handler: ModalLifecycleHandler<T, TModel>,
  ) => () => void
  onClose: (handler: ModalLifecycleHandler<T, TModel>) => () => void
  onSubmit: (handler: ModalLifecycleHandler<T, TModel>) => () => void
  onSave: (handler: ModalLifecycleHandler<T, TModel>) => () => void
  requestClose: () => Promise<unknown>
  requestSubmit: () => Promise<unknown>
}

export const modalRuntimeKey = Symbol(
  'modal-runtime',
) as InjectionKey<ModalRuntime>

export function useModal<T = unknown, TModel = unknown>(): ModalRuntime<
  T,
  TModel
> {
  const runtime = inject(modalRuntimeKey, null)

  if (!runtime) {
    throw new Error(
      'useModal() must be used inside content opened with Modal.open().',
    )
  }

  return runtime as ModalRuntime<T, TModel>
}
