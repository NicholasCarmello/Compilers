class ScopeNode{

    name: string;
    parent: ScopeNode;
    children: ScopeNode[] = []
    line: number;
    character: number;
    scope  = new Map();
}