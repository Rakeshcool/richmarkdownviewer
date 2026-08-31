# Complex Markdown Example

This document demonstrates nearly every supported Markdown feature.

## 1. Text Formatting

**Bold text** and *italic text* and ~~strikethrough text~~.

***Bold and italic*** combined.

## 2. Headings

### Level 3 Heading

#### Level 4 Heading

##### Level 5 Heading

###### Level 6 Heading

## 3. Lists

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Deeply nested item
- Third item

### Ordered List

1. Step one
2. Step two
   1. Sub-step 2.1
   2. Sub-step 2.2
3. Step three

### Task List

- [x] Complete the README
- [x] Set up the project
- [ ] Write tests
- [ ] Deploy to production
- [ ] Update documentation

## 4. Code Blocks

### JavaScript

```javascript
// Asynchronous function with async/await
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// Usage
const users = await fetchData('https://api.example.com/users');
console.log(users);
```

### Python

```python
from dataclasses import dataclass
from typing import List

@dataclass
class Task:
    title: str
    completed: bool = False
    
    def complete(self):
        self.completed = True

class TaskManager:
    def __init__(self):
        self.tasks: List[Task] = []
    
    def add_task(self, title: str) -> Task:
        task = Task(title=title)
        self.tasks.append(task)
        return task
    
    def get_pending(self) -> List[Task]:
        return [t for t in self.tasks if not t.completed]

# Example usage
manager = TaskManager()
manager.add_task("Learn Python")
manager.add_task("Build a project")
```

### Rust

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Red", 50);
    
    let team_name = "Blue";
    let score = scores.get(team_name).copied().unwrap_or(0);
    println!("The score for {} is: {}", team_name, score);
}
```

## 5. Tables

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Headings | ✓ | H1 through H6 |
| Lists | ✓ | Ordered, unordered, task |
| Code | ✓ | With syntax highlighting |
| Math | ✓ | LaTeX via KaTeX |
| Tables | ✓ | GitHub-style |
| Images | ✓ | Local and remote |
| Links | ✓ | Internal and external |

## 6. Blockquotes

> This is a blockquote. It can contain **formatted text** and `code`.
>
> > Nested blockquotes work too.

> [!NOTE]
> This is a note-style blockquote.

> [!TIP]
> This is a tip-style blockquote.

## 7. Links

- [GitHub](https://github.com)
- [Relative link](./basic.md)
- Auto-link: https://example.com

## 8. Images

![Sample Image](https://picsum.photos/400/200)

## 9. Mathematical Expressions

Inline: The equation $E = mc^2$ is famous.

Block:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 10. Horizontal Rules

---

***

___

## 11. Footnotes

Here is a footnote reference[^1] and another[^2].

[^1]: This is the first footnote.
[^2]: This is the second footnote with more content.

## 12. Definition Lists

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

## 13. Collapsed Sections

<details>
<summary>Click to expand</summary>

This content is hidden by default. It can contain any Markdown content.

- Item 1
- Item 2
- Item 3

</details>

## 14. Mixed Content

Here's a paragraph with **bold**, *italic*, and `code` all in one sentence. You can also add [links](https://example.com) and images ![img](https://picsum.photos/50/50) inline.

> Blockquotes can contain code:
>
> ```python
> print("Hello, World!")
> ```

And code blocks can appear after lists:

1. First item
2. Second item

```javascript
// Code after a list
const greeting = "Hello!";
```

## 15. Special Characters

These should render correctly:

- Ampersand: &
- Less than: <
- Greater than: >
- Quotes: " and '
- Apostrophe: '
- Hyphen: -
