
export class CheckGroup {


    private master: HTMLInputElement;
    private children: NodeListOf<HTMLInputElement>;

    /**
     * 
     * Create a check button group, with a master and a list of children.
     * All given parameters must be elements of the document
     * 
     * @param {HTMLElement} master 
     * @param {HTMLElement[]} children 
     */
    constructor(master: HTMLInputElement, children: NodeListOf<HTMLInputElement>) {
        this.master = master;
        this.children = children;
        master.addEventListener("change", () => {
            children.forEach(cb => {
                cb.checked = master.checked;
            })
        })

        children.forEach(cb => {
            cb.addEventListener("change", () => this.updateMasterCheckbox());
        });
        this.updateMasterCheckbox();
    }

    updateMasterCheckbox() {
        const checkedCount = [...this.children].filter(cb => cb.checked).length;

        if (checkedCount === 0) {
            this.master.checked = false;
            this.master.indeterminate = false;
        } else if (checkedCount === this.children.length) {
            this.master.checked = true;
            this.master.indeterminate = false;
        } else {
            this.master.checked = false;
            this.master.indeterminate = true;
        }
    }
}