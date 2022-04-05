class ScopeTree {
    root = null;
    currentNode = null;
    newNode;
    scopeTable = new Map();
    currentScope;
    currentScopeNum = 0;
    moveUp() {
        if ((this.currentNode.parent !== null) && (this.currentNode.parent.name !== undefined)) {
            this.currentNode = this.currentNode.parent;
        }
        else {
            // TODO: Some sort of error logging.
            // This really should not happen, but it will, of course.
        }
    }
    addNode(kind, label) {
        this.newNode = new ScopeNode();
        this.newNode.name = label;
        this.newNode.children = [];
        this.newNode.scope = new Map();
        this.currentScope = this.newNode.scope;
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
    toString() {
        // Initialize the result string.
        var traversalResult = "";
        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth) {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++) {
                traversalResult += "-";
            }
            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0) {
                // ... note the leaf node.
                traversalResult += "[" + node.name + "]";
                traversalResult += "\n";
            }
            else {
                // There are children, so note these interior/branch nodes and ...
                traversalResult += "<" + node.name + "> \n";
                // .. recursively expand them.
                for (var i = 0; i < node.children.length; i++) {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.root, 0);
        // Return the result.
        return traversalResult;
    }
    ;
}
//# sourceMappingURL=ScopeTree.js.map