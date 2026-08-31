# Code Examples

## JavaScript

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(`F(${i}) = ${fibonacci(i)}`);
}
```

## TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! Your email is ${user.email}.`;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

console.log(greetUser(user));
```

## Python

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(numbers))
```

## Rust

```rust
use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<&str, i32> = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Red", 50);

    let team_name = "Blue";
    let score = scores.get(team_name).copied().unwrap_or(0);
    println!("The score for {} is: {}", team_name, score);
}
```

## Go

```go
package main

import "fmt"

func main() {
    channels := make(chan string, 2)
    channels <- "Hello"
    channels <- "World"

    fmt.Println(<-channels)
    fmt.Println(<-channels)
}
```

## CSS

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}
```

## SQL

```sql
SELECT 
  users.name,
  COUNT(orders.id) as order_count,
  SUM(orders.total) as total_spent
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.created_at > '2023-01-01'
GROUP BY users.id, users.name
HAVING COUNT(orders.id) > 5
ORDER BY total_spent DESC
LIMIT 10;
```
