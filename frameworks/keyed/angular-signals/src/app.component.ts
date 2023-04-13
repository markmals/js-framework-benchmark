import { NgFor } from "@angular/common"
import { Component, signal } from "@angular/core"

interface Data {
    id: number
    label: string
}

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

@Component({
    selector: "app-root",
    standalone: true,
    imports: [NgFor],
    template: `
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Angular Signals (16.0.0-rc.0) keyed</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="run"
                                (click)="run()"
                                ref="text"
                            >
                                Create 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="runlots"
                                (click)="runLots()"
                            >
                                Create 10,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="add"
                                (click)="add()"
                                ref="text"
                            >
                                Append 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="update"
                                (click)="update()"
                            >
                                Update every 10th row
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="clear"
                                (click)="clear()"
                            >
                                Clear
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="swaprows"
                                (click)="swapRows()"
                            >
                                Swap Rows
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    <tr
                        [class.danger]="isSelected(item.id)"
                        *ngFor="let item of data(); trackBy: itemById"
                    >
                        <td class="col-md-1">{{ item.id }}</td>
                        <td class="col-md-4">
                            <a href="#" (click)="select(item, $event)">{{ item.label }}</a>
                        </td>
                        <td class="col-md-1">
                            <a href="#" (click)="remove(item, $event)">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </a>
                        </td>
                        <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
    `,
})
export class AppComponent {
    data = signal<Data[]>([])
    selected = signal<number | null>(null)

    isSelected(id?: number) {
        if (id) return this.selected() === id
        return false
    }

    buildData(count: number = 1000): Data[] {
        let data: Data[] = []
        let array = new Array(count)

        for (let _ of array) {
            data.push({
                id: idCounter,
                label: `${adjectives[this._random(adjectives.length)]} ${
                    colours[this._random(colours.length)]
                } ${nouns[this._random(nouns.length)]}`,
            })

            idCounter += 1
        }

        return data
    }

    _random(max: number) {
        return Math.round(Math.random() * 1000) % max
    }

    itemById(index: number, item: Data) {
        return item.id
    }

    select(item: Data, event: Event) {
        event.preventDefault()
        this.selected.set(item.id)
    }

    remove(item: Data, event: Event) {
        event.preventDefault()
        this.data.update(d => {
            const idx = d.findIndex(d => d.id === item.id)
            return [...d.slice(0, idx), ...d.slice(idx + 1)]
        })
    }

    run() {
        this.data.set(this.buildData())
    }

    add() {
        this.data.update($ => $.concat(this.buildData(1000)))
    }

    update() {
        this.data.mutate(d => {
            for (let i = 0, len = d.length; i < len; i += 10) {
                d[i].label = d[i].label + " !!!"
            }
        })
    }

    runLots() {
        this.data.set(this.buildData(10000))
    }

    clear() {
        this.data.set([])
    }

    swapRows() {
        const d = this.data().slice()
        if (d.length > 998) {
            let tmp = d[1]
            d[1] = d[998]
            d[998] = tmp
            this.data.set(d)
        }
    }
}
