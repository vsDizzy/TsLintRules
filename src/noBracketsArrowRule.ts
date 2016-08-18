import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Only surround arrow function parameters when necessary.';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ArrowFunctionWalker(sourceFile, this.getOptions()));
  }
}

class ArrowFunctionWalker extends Lint.RuleWalker {
  public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
    if (node.kind === ts.SyntaxKind.ArrowFunction) {
      if (node.parameters.length == 1) {
        let sf = node.getSourceFile();
        let text = node.getText(sf);

        if (/^\(/.test(text)) {
          this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
      }
    }

    super.visitArrowFunction(node);
  }
}