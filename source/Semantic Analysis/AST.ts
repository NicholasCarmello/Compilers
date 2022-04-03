class AbstractSyntaxTree {

    root: TreeNode = null
    currentNode: TreeNode = null
    newNode: TreeNode;
    scopeTable: any = new Map();
    currentScope: any;
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
        this.newNode = new TreeNode();
        this.newNode.name = label
        this.newNode.children = []

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


    depth2: any = []
    toString() {
        // Initialize the result string.
        var traversalResult = "";
        let depth3 = []
        let scopeTree = new ScopeTree();
        let scopeBlock = 0;
        let currentScope;
        let currentParent;
        let firstChild = null;
        let secondChild = null;
        let thirdChild = null;
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

                depth3.push(node)
                if (currentParent == "VarDecl") {
                    if (firstChild == null) {
                        firstChild = node.name
                    } else {
                        if (secondChild == null) {
                            secondChild = node.name
                        }
                    }
                    if (firstChild != null && secondChild != null) {
                        currentScope.scope[secondChild] = firstChild;
                        output("DEBUG SEMANTIC - SUCCESS - Variable [" + secondChild + "] has been declared");
                        firstChild = null
                        secondChild = null

                    }

                }
                else if (currentParent == "Assignment Statement") {
                    if (firstChild == null) {
                        firstChild = node.name
                    }else{
                        secondChild = node.name
                        console.log(firstChild)
                        console.log(secondChild)
                        currentScope.scope[secondChild] = firstChild;


                    }
                }else if(currentParent == "Addition Op"){
                    if (secondChild == null){

                        secondChild = node.name
                    }else {
                        
                        if (/^[a-z]$/.test(node.name)){
                            secondChild += node.name
                            currentScope.scope[secondChild] = firstChild;
                            console.log(currentScope.scope)
                            firstChild = null;
                            secondChild = null;
                        }
                        else{
                            secondChild += node.name
                        }
                    }
                    
                }
                



                traversalResult += "[" + node.name + "]";
                traversalResult += "\n";

            }
            else {
                // There are children, so note these interior/branch nodes and ...
                depth3.push(node)
                traversalResult += "<" + node.name + "> \n";
                // .. recursively expand them.
                if (node.name == "Block") {
                    if (scopeBlock == 0) {
                        scopeTree.addNode("root", "Block");
                        scopeTree.moveUp();
                        currentScope = scopeTree.currentNode;
                    } else {
                        scopeTree.addNode("branch", "Block");
                        scopeTree.moveUp();
                        currentScope = scopeTree.currentNode.parent;

                    }
                } else if (node.name == "VarDecl") {
                    currentParent = "VarDecl"

                }
                else if (node.name == "Assignment Statement") {
                    currentParent = "Assignment Statement"

                }
                else if(node.name = "Addition Op"){
                    currentParent = "Addition Op"
                }

                for (var i = 0; i < node.children.length; i++) {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.root, 0);
        // Return the result.
        this.depth2 = depth3;
        return traversalResult;
    };
}