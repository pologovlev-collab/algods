---
{
  "id": "s17-l01",
  "slug": "trie-prefix-index",
  "title": "Trie как индекс префиксов",
  "stage": 17,
  "order": 1,
  "prerequisites": ["s02-l02", "s10-l01"],
  "core": true,
  "patterns": ["trie"],
  "summary": "В trie путь от корня кодирует общий префикс, а terminal отделяет полное слово от просто существующего префикса.",
  "outcomes": ["объяснять разделение общих префиксов в trie", "реализовывать insert, contains и hasPrefix"],
  "practice": {"miniChecks": 2, "guidedExercises": 1, "independentExercises": 1}
}
---
# Trie как индекс префиксов

Hash set быстро отвечает «есть ли точное слово?», но не отвечает «есть ли слово с таким началом?» без просмотра всех слов. Trie хранит общие начала один раз и превращает запрос префикса в проход по его символам.

<!-- algods:problem-shape -->
## Как словарю отвечать на начало слова

Нужно поддерживать добавление английских слов в нижнем регистре, проверку полного слова и проверку существования хотя бы одного слова с заданным префиксом. После добавления `"cat"` и `"car"`: `contains("cat")` истинно, `contains("ca")` ложно, `hasPrefix("ca")` истинно.

<!-- algods:brute-force -->
## Что повторяет поиск по всем словам

Хранить все слова в массиве. Для `hasPrefix(prefix)` проверять `word.starts_with(prefix)` у каждого слова: до `O(totalCharacters)` на запрос. При большом словаре автодополнение снова и снова сравнивает одинаковые первые буквы.

<!-- algods:bottleneck -->
## Где одинаковые буквы сравниваются снова

Тысячи слов могут начинаться с `ca`. Полный перебор повторяет сравнение `c`, затем `a` для каждого из них. В trie этот общий путь хранится как два узла, а не как фрагменты множества строк.

<!-- algods:key-observation -->
## Почему путь кодирует общий префикс

Путь от корня по буквам полностью кодирует префикс. Если нужного ребёнка нет, ни одно добавленное слово не имеет такой префикс. Флаг `terminal` нужен потому, что путь `c -> a -> t` существует и после добавления `"catalog"`, но это ещё не означает, что слово `"cat"` добавляли.

<!-- algods:invariant-state -->
## Что означает terminal у узла

После добавления каждого слова для каждого его префикса существует путь от корня, а только последний узел помечен `terminal`. Во время поиска `node` соответствует ровно обработанному префиксу запроса; после каждого символа он либо переходит к правильному ребёнку, либо поиск прекращается.

<!-- algods:algorithm -->
## Как вставить и найти слово по буквам

1. Для вставки начать в корне и создать недостающий ребёнок для каждой буквы.
2. После последней буквы поставить `terminal = true`.
3. Для `hasPrefix` пройти путь; успех означает, что путь существует.
4. Для `contains` после такого же прохода дополнительно проверить `terminal`.

<!-- algods:implementation -->
## Как ограничить trie алфавитом a..z

Ниже алфавит ограничен `a..z`, поэтому у узла фиксированный массив из 26 ссылок. Для произвольного Unicode/кириллицы понадобится словарь детей и отдельная оценка памяти.

### C++17

```cpp
#include <array>
#include <cassert>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>

using namespace std;

struct Node {
    array<unique_ptr<Node>, 26> next{};
    bool terminal = false;
};

class Trie {
public:
    void insert(const string& word) {
        for (char ch : word) {
            if (ch < 'a' || ch > 'z') {
                throw invalid_argument("only lowercase a-z words are supported");
            }
        }

        Node* node = &root;
        for (char ch : word) {
            size_t index = static_cast<size_t>(ch - 'a');
            if (!node->next[index]) node->next[index] = make_unique<Node>();
            node = node->next[index].get();
        }
        node->terminal = true;
    }

    bool contains(const string& word) const {
        const Node* node = findNode(word);
        return node != nullptr && node->terminal;
    }

    bool hasPrefix(const string& prefix) const {
        return findNode(prefix) != nullptr;
    }

private:
    Node root;

    const Node* findNode(const string& text) const {
        const Node* node = &root;
        for (char ch : text) {
            if (ch < 'a' || ch > 'z') return nullptr;
            size_t index = static_cast<size_t>(ch - 'a');
            if (!node->next[index]) return nullptr;
            node = node->next[index].get();
        }
        return node;
    }
};

int main() {
    Trie trie;
    trie.insert("cat");
    trie.insert("car");
    assert(trie.contains("cat"));
    assert(!trie.contains("ca"));
    assert(trie.hasPrefix("ca"));
    bool rejected = false;
    try {
        trie.insert("abC");
    } catch (const invalid_argument&) {
        rejected = true;
    }
    assert(rejected);
    assert(!trie.hasPrefix("ab"));
    cout << trie.hasPrefix("dog") << '\n';
}
```

### Python 3

```python
class Node:
    def __init__(self) -> None:
        self.next: dict[str, Node] = {}
        self.terminal = False


class Trie:
    def __init__(self) -> None:
        self.root = Node()

    def insert(self, word: str) -> None:
        if any(not "a" <= char <= "z" for char in word):
            raise ValueError("only lowercase a-z words are supported")

        node = self.root
        for char in word:
            child = node.next.get(char)
            if child is None:
                child = Node()
                node.next[char] = child
            node = child
        node.terminal = True

    def _find_node(self, text: str) -> Node | None:
        node = self.root
        for char in text:
            if not "a" <= char <= "z":
                return None
            if char not in node.next:
                return None
            node = node.next[char]
        return node

    def contains(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.terminal

    def has_prefix(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None


trie = Trie()
trie.insert("cat")
trie.insert("car")
assert trie.contains("cat")
assert not trie.contains("ca")
assert trie.has_prefix("ca")
try:
    trie.insert("abC")
    assert False, "uppercase input must be rejected"
except ValueError:
    pass
assert not trie.has_prefix("ab")
print(trie.has_prefix("dog"))
```

<!-- algods:complexity -->
## Сколько стоит путь по символам

Вставка, `contains` и `hasPrefix` занимают `O(L)`, где `L` — длина запроса, независимо от числа слов. Память `O(totalDistinctPrefixes)`. Фиксированный C++-массив ускоряет переход, но резервирует 26 ссылок на каждый узел; Python-словарь хранит только существующих детей, но несёт накладные расходы.

## Фиксированный массив детей или словарь переходов

Фиксированный массив даёт прямой переход по индексу символа и предсказуемую стоимость, но резервирует место под весь алфавит в каждом узле. Словарь/map детей хранит только существующие рёбра и удобен для большого или разреженного алфавита, однако каждый переход несёт стоимость хеш-таблицы или дерева и дополнительную служебную память.

Terminal отделяет два разных факта: путь доказывает существование **префикса**, а terminal в последнем узле доказывает, что здесь заканчивается **полное слово**. Без флага добавление `catalog` ошибочно заставило бы `contains("cat")` вернуть истину.

По сравнению с хеш-множеством Trie переиспользует общие префиксы и отвечает на prefix-запрос за `O(L)`, но создаёт много узлов и ссылок. Хеш-множество обычно компактнее и проще для только точного членства; Trie выбирают, когда общий префикс является частью запроса.

<!-- algods:edge-cases -->
## Какие слова требуют явного контракта

Пустая строка: её можно считать словом только если явно вставить корневой `terminal`; решите это контрактом. Повторная вставка не должна создавать дубликат. `"car"` и `"cart"` различаются флагом terminal. В C++ нельзя передавать символы вне `a..z` без проверок или нормализации.

<!-- algods:tests -->
## Какими словами проверить префиксный индекс

- вставка одного слова и точный поиск;
- префикс существует, но не является словом: `ca` после `cat`;
- слово — префикс другого: `car`, `cart`;
- отсутствующая первая и отсутствующая последняя буква;
- повторная вставка;
- оговорённое поведение пустой строки.

<!-- algods:recognition -->
## Когда точного совпадения уже мало

Сигналы: много строк, частые запросы начала слова, автодополнение, словарь запрещённых префиксов, поиск по символам. Если важен префикс, а не только целая строка, hash set часто недостаточен.

<!-- algods:when-not-to-use -->
## Когда trie тяжелее простого множества

Для редких точных запросов hash set проще и обычно экономнее. Trie не ускоряет поиск произвольной подстроки и может быть дорогим на большом Unicode-алфавите. Не выбирайте фиксированные 26 детей для входа с кириллицей, если не задали нормализацию.

<!-- algods:mini-check-1 -->
## Самопроверка пути без целого слова

Вопрос: почему `contains("ca")` ложно после вставки `"cat"`?  
Ответ: путь `c -> a` существует, но его узел не terminal; `ca` — префикс, а не добавленное слово.

<!-- algods:mini-check-2 -->
## Самопроверка общего начала

Вопрос: сколько раз в trie хранится префикс `"pre"`, если добавлены `prefix`, `prepare`, `prevent`?  
Ответ: один путь `p -> r -> e`; дальше ветви расходятся. В этом и состоит выигрыш для общих начал.

<!-- algods:guided-practice -->
## Потренируйте счётчик слов под префиксом

Добавьте метод `countPrefix(prefix)`, который считает все terminal-слова ниже найденного узла. Сначала решите, какую информацию можно пересчитывать обходом, а какую выгодно хранить в каждом узле. Подсказка: счётчик поддерева делает запрос быстрым, но его нужно обновлять при вставке.

<!-- algods:independent-practice -->
## Самостоятельный префиксный индекс

Работайте без подсказок: заранее выберите алфавит, контракт пустой строки и поведение для недопустимого символа.

### Задача 1

Реализуйте структуру для добавления строчных английских слов и запроса количества добавленных слов, начинающихся с заданного префикса. Повторная вставка слова не должна искажать ответ.

<!-- algods:takeaway -->
## Что хранит trie кроме самих слов

Trie индексирует не слова целиком, а их общие префиксы. Путь отвечает на вопрос «может ли слово так начинаться», а terminal — на вопрос «заканчивается ли здесь слово».
