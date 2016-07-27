import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Only surround arrow function parameters when necessary.';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ArrowFunctionWalker(sourceFile, this.getOptions()));
  }
}

class ArrowFunctionWalker extends Lint.RuleWalker {
  public visitNode(node) {
    if (node.kind === ts.SyntaxKind.Parameter
      && node.parent.kind === ts.SyntaxKind.ArrowFunction) {

      let nodes = node.parent._children;
      if (nodes.length === 5
        && nodes[0].kind === ts.SyntaxKind.OpenParenToken
        && nodes[1].kind === ts.SyntaxKind.SyntaxList
        && nodes[1]._children.length === 1
        && nodes[2].kind === ts.SyntaxKind.CloseParenToken) {

        this.addFailure(this.createFailure(nodes[1].getStart(), nodes[1].getWidth(), Rule.FAILURE_STRING));
      }
    }

    super.visitNode(node);
  }
}