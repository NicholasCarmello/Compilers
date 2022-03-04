import { TreeNode } from "./TreeNode";
export class ConcreteSyntaxTree {

    root: TreeNode = null
    currentNode: TreeNode = null
    newNode: TreeNode;

    addNode(kind, label) {
        this.newNode = new TreeNode();
        this.newNode.name = label
        if (this.root == null) {
            this.root = this.newNode;
            this.newNode.parent = null
        }
        else {
            this.newNode.parent = this.currentNode
            this.newNode.parent.children.push(this.newNode)
        }
        if (kind != "leaf") {
            this.currentNode = this.newNode
        }
    }
}