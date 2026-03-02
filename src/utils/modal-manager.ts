export class ModalManager {
  private stack = new Set<string>();
  open(id: string) { this.stack.add(id); }
  close(id: string) { this.stack.delete(id); }
  isOpen(id: string) { return this.stack.has(id); }

}

export class ModalRegistry {
  private modals = new Map<string, any>();

  register(id: string, component: any) {
    this.modals.set(id, component);
  }

  get(id: string) {
    return this.modals.get(id);
  }
}

export class Modal {
  constructor(public id: string, public component: any) {}

}
