import { signal } from "@angular/core"
import { createSelector, map, render } from "angular-signals-jsx"

let idCounter = 1
const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
]
const colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
]
const nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
]

function _random(max) {
    return Math.round(Math.random() * 1000) % max
}

function buildData(count) {
    let data = []
    let array = new Array(count)

    for (let _ of array) {
        data.push({
            id: idCounter++,
            label: signal(
                `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${
                    nouns[_random(nouns.length)]
                }`
            ),
        })
    }

    return data
}

const Button = ({ id, text, fn }) => (
    <div class="col-sm-6 smallpad">
        <button id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>
            {text}
        </button>
    </div>
)

const App = () => {
    const data = signal([])
    const selected = signal(null)
    const isSelected = createSelector(() => selected())

    return (
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Angular Signals JSX Keyed</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <Button id="run" text="Create 1,000 rows" fn={run} />
                            <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
                            <Button id="add" text="Append 1,000 rows" fn={add} />
                            <Button id="update" text="Update every 10th row" fn={update} />
                            <Button id="clear" text="Clear" fn={clear} />
                            <Button id="swaprows" text="Swap Rows" fn={swapRows} />
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    {map(
                        () => data(),
                        row => {
                            const rowId = row.id
                            return (
                                <tr class={isSelected(rowId) ? "danger" : ""}>
                                    <td class="col-md-1" textContent={rowId} />
                                    <td class="col-md-4">
                                        <a
                                            onClick={[setSelected, rowId]}
                                            textContent={row.label()}
                                        />
                                    </td>
                                    <td class="col-md-1">
                                        <a onClick={[remove, rowId]}>
                                            <span
                                                class="glyphicon glyphicon-remove"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </td>
                                    <td class="col-md-6" />
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
        </div>
    )

    function setSelected(id) {
        selected.set(id)
    }

    function remove(id) {
        data.update(d => {
            const idx = d.findIndex(d => d.id === id)
            return [...d.slice(0, idx), ...d.slice(idx + 1)]
        })
    }

    function run() {
        data.set(buildData(1000))
    }

    function runLots() {
        data.set(buildData(10000))
    }

    function add() {
        data.update($ => $.concat(buildData(1000)))
    }

    function update() {
        const d = data()
        for (let i = 0, len = d.length; i < len; i += 10) {
            d[i].label.update($ => $ + " !!!")
        }
    }

    function swapRows() {
        const d = data().slice()
        if (d.length > 998) {
            let tmp = d[1]
            d[1] = d[998]
            d[998] = tmp
            data.set(d)
        }
    }

    function clear() {
        data.set([])
    }
}

render(App, document.getElementById("main"))
