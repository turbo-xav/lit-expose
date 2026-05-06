import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

type TodoItem = {
  id: number
  label: string
  completed: boolean
  isDeleting?: boolean
}

type TodoListChangeDetail = {
  todos: TodoItem[]
  remainingCount: number
}

/**
 * Todo list réutilisable.
 *
 * @csspart container - Conteneur principal de la todo list.
 * @csspart title - Titre du composant.
 * @csspart input - Champ de saisie.
 * @csspart add-button - Bouton d'ajout.
 * @csspart item - Élément de tâche.
 * @csspart delete-button - Bouton de suppression.
 *
 * @fires todo-list-change - Émis quand une tâche est ajoutée, supprimée ou modifiée.
 */
@customElement('todo-list')
export class ToDoList extends LitElement {
  /**
   * Titre affiché au-dessus de la liste.
   */
  @property({ type: String })
  title = 'Ma todo list'

  @state()
  private todos: TodoItem[] = [
    {
      id: 1,
      label: 'Découvrir Lit',
      completed: true,
    },
    {
      id: 2,
      label: 'Configurer Module Federation',
      completed: false,
    },
    {
      id: 3,
      label: 'Créer un composant réutilisable',
      completed: false,
    },
  ]

  @state()
  private newTodoLabel = ''

  private nextTodoId = 4

  render() {
    return html`
      <section class="container" part="container">
        <header>
          <slot name="title">
            <h2 part="title">${this.title}</h2>
          </slot>
          <p>
            ${this.remainingCount} tâche${this.remainingCount > 1 ? 's' : ''}
            restante${this.remainingCount > 1 ? 's' : ''}
          </p>
        </header>

        <form class="form" @submit=${this.addTodo}>
          <label>
            <span>Nouvelle tâche</span>
            <input
              part="input"
              type="text"
              .value=${this.newTodoLabel}
              placeholder="Ex: écrire un test"
              @input=${this.updateNewTodoLabel}
            />
          </label>

          <button part="add-button" type="submit">Ajouter</button>
        </form>

        ${this.todos.length === 0
          ? html`<p class="empty">Aucune tâche pour le moment.</p>`
          : html`
              <ul>
                ${this.todos.map((todo) => this.renderTodo(todo))}
              </ul>
            `}
      </section>
    `
  }

  private get remainingCount() {
    return this.todos.filter((todo) => !todo.completed).length
  }

  private updateNewTodoLabel(event: Event) {
    const input = event.target as HTMLInputElement
    this.newTodoLabel = input.value
  }

  private addTodo(event: SubmitEvent) {
    event.preventDefault()

    const label = this.newTodoLabel.trim()

    if (!label) {
      return
    }

    this.todos = [
      ...this.todos,
      {
        id: this.nextTodoId++,
        label,
        completed: false,
      },
    ]

    this.newTodoLabel = ''
    this.emitChange()
  }

  private toggleTodo(id: number) {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
          }
        : todo,
    )

    this.emitChange()
  }

  private deleteTodo(id: number) {
    this.todos = this.todos.map((todo) =>
        todo.id === id
            ? {
              ...todo,
              isDeleting: true,
            }
            : todo,
    )

    window.setTimeout(() => {
      this.todos = this.todos.filter((todo) => todo.id !== id)
      this.emitChange()
    }, 800)
  }


  private emitChange() {
    this.dispatchEvent(
      new CustomEvent<TodoListChangeDetail>('todo-list-change', {
        detail: {
          todos: this.todos.map((todo) => ({ ...todo })),
          remainingCount: this.remainingCount,
        },
        bubbles: true,
        composed: true,
      }),
    )
  }



// ... existing code ...
  private renderTodo(todo: TodoItem) {
    const classes = [todo.completed ? 'completed' : '', todo.isDeleting ? 'deleting' : '']
        .filter(Boolean)
        .join(' ')

    return html`<li class=${classes} part="item">
                <label>
                  <input
                    type="checkbox"
                    .checked=${todo.completed}
                    ?disabled=${todo.isDeleting}
                    @change=${() => this.toggleTodo(todo.id)}
                  />
                  <span>${todo.label}</span>
                </label>

                <button
                  part="delete-button"
                  type="button"
                  aria-label=${`Supprimer la tâche ${todo.label}`}
                  @click=${() => this.deleteTodo(todo.id)}
                >
                  Supprimer
                </button>
              </li>`
  }

  // ... existing code ...
  static styles = css`
    :host {
      --bg: #ffffff;
      --surface: #f7faf8;
      --text: #1f2933;
      --muted: #5f6f67;
      --border: #d8e3dc;
      --accent: #00875a;
      --accent-hover: #006b48;
      --accent-soft: #e6f4ee;
      --danger: #b42318;
      --danger-soft: #fff1f0;
      --radius: 8px;
      --shadow: 0 8px 24px rgba(0, 80, 55, 0.08);

      display: block;
      max-width: 560px;
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .container {
      position: relative;
      overflow: hidden;
      padding: 28px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(0, 135, 90, 0.06), transparent 120px), var(--bg);
      box-shadow: var(--shadow);
    }

    .container::before {
      content: '';
      position: absolute;
      inset: 0 auto 0 0;
      width: 5px;
      background: var(--accent);
    }

    header,
    .form {
      margin-bottom: 22px;
    }

    header {
      padding-left: 4px;
    }

    h2,
    p {
      margin: 0;
    }

    h2 {
      color: var(--text);
      font-size: 24px;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    p {
      margin-top: 8px;
      color: var(--muted);
      font-size: 14px;
    }

    .form {
      display: flex;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
    }

    label {
      flex: 1;
    }

    label span {
      display: block;
      margin-bottom: 6px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
    }

    input,
    button {
      font: inherit;
      border-radius: 6px;
    }

    input[type='text'] {
      width: 100%;
      box-sizing: border-box;
      padding: 11px 12px;
      border: 1px solid var(--border);
      color: var(--text);
      background: #ffffff;
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    input[type='text']::placeholder {
      color: #8b9b93;
    }

    input[type='text']:focus,
    button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 135, 90, 0.18);
    }

    input[type='text']:focus {
      border-color: var(--accent);
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      accent-color: var(--accent);
      cursor: pointer;
    }

    button {
      border: 0;
      padding: 11px 16px;
      color: #ffffff;
      background: var(--accent);
      font-weight: 700;
      cursor: pointer;
      transition:
        background-color 0.2s ease,
        transform 0.1s ease;
    }

    button:hover {
      background: var(--accent-hover);
    }

    button:active {
      transform: translateY(1px);
    }

    .form button {
      align-self: end;
      min-width: 104px;
    }

    ul {
      display: grid;
      gap: 10px;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: #ffffff;
      animation: todo-item-enter 0.8s ease-out both;
      transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
    }

    li.deleting {
      pointer-events: none;
      animation: todo-item-exit 0.8s ease-in both;
    }

    li:hover {
      border-color: color-mix(in srgb, var(--accent), white 55%);
      box-shadow: 0 4px 14px rgba(0, 80, 55, 0.06);
    }

    @keyframes todo-item-enter {
      from {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes todo-item-exit {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      to {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
      }
    }

    li label {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    li label span {
      margin: 0;
      color: var(--text);
      font-size: 15px;
      overflow-wrap: anywhere;
    }

    li.completed {
      background: var(--accent-soft);
    }

    li.completed label span {
      color: var(--muted);
      text-decoration: line-through;
    }

    li button {
      flex: 0 0 auto;
      border: 1px solid rgba(180, 35, 24, 0.22);
      color: var(--danger);
      background: var(--danger-soft);
      font-size: 14px;
    }

    li button:hover {
      color: #ffffff;
      background: var(--danger);
    }


    @media (max-width: 520px) {
      .container {
        padding: 22px;
      }

      .form,
      li {
        flex-direction: column;
      }

      .form button,
      li button {
        width: 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation: none;
        transition: none;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --bg: #111c18;
        --surface: #15251f;
        --text: #f3faf6;
        --muted: #a8b8b0;
        --border: #294139;
        --accent: #00a66f;
        --accent-hover: #00bf80;
        --accent-soft: rgba(0, 166, 111, 0.16);
        --danger: #ff6b5f;
        --danger-soft: rgba(255, 107, 95, 0.12);
        --shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      }

      input[type='text'],
      li {
        background: #101a17;
      }

      input[type='text']::placeholder {
        color: #778a82;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-list': ToDoList
  }
}