
class CodeGen{
    astRoot: any;
    image:any = []
    staticData:any = []
    jumps:any = []

    
    codeGeneration() {
        // Initialize the result string.
        let depth3 = []
        let currentParent;
       
        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth) {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            
            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0) {
                // ... note the leaf node.

                depth3.push(node)






                

            }
            else {
                // There are children, so note these interior/branch nodes and ...
                // .. recursively expand them.
                currentParent = node.name
                for (var i = 0; i < node.children.length; i++) {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.astRoot, 0);
        // Return the result.

        return traversalResult;
    };




}