import { TreeNode } from "./TreeNode";
class ConcreteSyntaxTree {
    root = null;
    currentNode = null;
    newNode;
    addNode(kind, label) {
        this.newNode = new TreeNode();
        this.newNode.name = label;
        if (this.root == null) {
            this.root = this.newNode;
            this.newNode.parent = null;
        }
        else {
            this.newNode.parent = this.currentNode;
            this.newNode.parent.children.push(this.newNode);
        }
        if (kind != "leaf") {
            this.currentNode = this.newNode;
        }
    }
}
//# sourceMappingURL=CST.js.map