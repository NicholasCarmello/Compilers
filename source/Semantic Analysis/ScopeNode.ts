
//Nodes for the scopeTree class. They need all of these attributes.
class ScopeNode {
    name: string;
    parent: ScopeNode;
    children: ScopeNode[] = []
    line: number;
    character: number;
    scope = new Map();
}