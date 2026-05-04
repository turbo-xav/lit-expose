import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

type TodoItem = {
  id: number
  label: string
  completed: boolean
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
          <h2 part="title">${this.title}</h2>
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
    this.todos = this.todos.filter((todo) => todo.id !== id)
    this.emitChange()
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
    return html`<li class=${todo.completed ? 'completed' : ''} part="item">
                <label>
                  <input
                    type="checkbox"
                    .checked=${todo.completed}
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

  static styles = css`
    :host {
      --todo-bg: #ffffff;
      --todo-surface: #f7faf8;
      --todo-text: #1f2933;
      --todo-muted: #5f6f67;
      --todo-border: #d8e3dc;
      --todo-accent: #00875a;
      --todo-accent-hover: #006b48;
      --todo-accent-soft: #e6f4ee;
      --todo-danger: #b42318;
      --todo-danger-soft: #fff1f0;
      --todo-radius: 8px;
      --todo-shadow: 0 8px 24px rgba(0, 80, 55, 0.08);

      display: block;
      max-width: 560px;
      color: var(--todo-text);
      font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    }

    .container {
      position: relative;
      overflow: hidden;
      padding: 28px;
      border: 1px solid var(--todo-border);
      border-radius: var(--todo-radius);
      background:
        linear-gradient(180deg, rgba(0, 135, 90, 0.06), transparent 120px),
        var(--todo-bg);
      box-shadow: var(--todo-shadow);
    }

    .container::before {
      content: '';
      position: absolute;
      inset: 0 auto 0 0;
      width: 5px;
      background: var(--todo-accent);
    }

    header {
      margin-bottom: 22px;
      padding-left: 4px;
    }

    h2 {
      margin: 0;
      color: var(--todo-text);
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    p {
      margin: 8px 0 0;
      color: var(--todo-muted);
      font-size: 14px;
    }

    .form {
      display: flex;
      gap: 12px;
      margin-bottom: 22px;
      padding: 16px;
      border: 1px solid var(--todo-border);
      border-radius: var(--todo-radius);
      background: var(--todo-surface);
    }

    label {
      flex: 1;
    }

    label span {
      display: block;
      margin-bottom: 6px;
      color: var(--todo-muted);
      font-size: 13px;
      font-weight: 600;
    }

    input[type='text'] {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--todo-border);
      border-radius: 6px;
      padding: 11px 12px;
      color: var(--todo-text);
      background: #ffffff;
      font: inherit;
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    input[type='text']::placeholder {
      color: #8b9b93;
    }

    input[type='text']:focus {
      border-color: var(--todo-accent);
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 135, 90, 0.16);
    }

    button {
      border: 0;
      border-radius: 6px;
      padding: 11px 16px;
      color: #ffffff;
      background: var(--todo-accent);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.1s ease;
    }

    button:hover {
      background: var(--todo-accent-hover);
    }

    button:active {
      transform: translateY(1px);
    }

    button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 135, 90, 0.22);
    }

    .form button {
      align-self: end;
      min-width: 104px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 10px;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--todo-border);
      border-radius: var(--todo-radius);
      background: #ffffff;
      transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    li:hover {
      border-color: color-mix(in srgb, var(--todo-accent), white 55%);
      box-shadow: 0 4px 14px rgba(0, 80, 55, 0.06);
    }

    li label {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      accent-color: var(--todo-accent);
      cursor: pointer;
    }

    li label span {
      margin: 0;
      color: var(--todo-text);
      font-size: 15px;
      overflow-wrap: anywhere;
    }

    li.completed {
      background: var(--todo-accent-soft);
    }

    li.completed label span {
      color: var(--todo-muted);
      text-decoration: line-through;
    }

    li button {
      flex: 0 0 auto;
      border: 1px solid rgba(180, 35, 24, 0.22);
      color: var(--todo-danger);
      background: var(--todo-danger-soft);
      font-size: 14px;
      font-weight: 700;
    }

    li button:hover {
      color: #ffffff;
      background: var(--todo-danger);
    }

    .empty {
      padding: 18px;
      text-align: center;
      border: 1px dashed var(--todo-border);
      border-radius: var(--todo-radius);
      background: var(--todo-surface);
    }

    @media (max-width: 520px) {
      .container {
        padding: 22px;
      }

      .form {
        flex-direction: column;
      }

      .form button {
        align-self: stretch;
      }

      li {
        align-items: stretch;
        flex-direction: column;
      }

      li button {
        width: 100%;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --todo-bg: #111c18;
        --todo-surface: #15251f;
        --todo-text: #f3faf6;
        --todo-muted: #a8b8b0;
        --todo-border: #294139;
        --todo-accent: #00a66f;
        --todo-accent-hover: #00bf80;
        --todo-accent-soft: rgba(0, 166, 111, 0.16);
        --todo-danger: #ff6b5f;
        --todo-danger-soft: rgba(255, 107, 95, 0.12);
        --todo-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
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
