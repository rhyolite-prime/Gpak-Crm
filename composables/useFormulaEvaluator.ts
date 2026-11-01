export const useFormulaEvaluator = () => {

    type Token = 
        | { type: 'NUMBER', value: number }
        | { type: 'OPERATOR', value: string }
        | { type: 'VARIABLE', value: string }
        | { type: 'FUNCTION', value: string }
        | { type: 'LPAREN' }
        | { type: 'RPAREN' }
        | { type: 'COMMA' }
        | { type: 'EOF' };

    const tokenize = (expression: string): Token[] => {
        const tokens: Token[] = [];
        let i = 0;

        while (i < expression.length) {
            const char = expression[i];

            if (/\s/.test(char)) {
                i++;
                continue;
            }

            if (/[0-9.]/.test(char)) {
                let numStr = '';
                while (i < expression.length && /[0-9.]/.test(expression[i])) {
                    numStr += expression[i];
                    i++;
                }
                tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
                continue;
            }

            if (/[a-zA-Z]/.test(char)) {
                let funcName = '';
                while (i < expression.length && /[a-zA-Z_]/.test(expression[i])) {
                    funcName += expression[i];
                    i++;
                }
                tokens.push({ type: 'FUNCTION', value: funcName.toUpperCase() });
                continue;
            }

            if ('+-*/'.includes(char)) {
                tokens.push({ type: 'OPERATOR', value: char });
                i++;
                continue;
            }

            if (char === '(') {
                tokens.push({ type: 'LPAREN' });
                i++;
                continue;
            }

            if (char === ')') {
                tokens.push({ type: 'RPAREN' });
                i++;
                continue;
            }

            if (char === ',') {
                tokens.push({ type: 'COMMA' });
                i++;
                continue;
            }

            if (char === '[') {
                let varName = '';
                i++; // skip [
                while (i < expression.length && expression[i] !== ']') {
                    varName += expression[i];
                    i++;
                }
                i++; // skip ]
                tokens.push({ type: 'VARIABLE', value: varName });
                continue;
            }

            throw new Error(`Unexpected character: ${char}`);
        }

        tokens.push({ type: 'EOF' });
        return tokens;
    };

    const parse = (tokens: Token[]) => {
        let current = 0;

        const peek = () => tokens[current];
        const consume = () => tokens[current++];

        // Expression -> Term ((+ | -) Term)*
        const parseExpression = (): any => {
            let node = parseTerm();
            while (peek().type === 'OPERATOR' && ((peek() as any).value === '+' || (peek() as any).value === '-')) {
                const operator = consume() as any;
                const right = parseTerm();
                node = { type: 'BinaryExpression', operator: operator.value, left: node, right };
            }
            return node;
        };

        // Term -> Factor ((* | /) Factor)*
        const parseTerm = (): any => {
            let node = parseFactor();
            while (peek().type === 'OPERATOR' && ((peek() as any).value === '*' || (peek() as any).value === '/')) {
                const operator = consume() as any;
                const right = parseFactor();
                node = { type: 'BinaryExpression', operator: operator.value, left: node, right };
            }
            return node;
        };

        // Factor -> NUMBER | VARIABLE | FUNCTION(Expression) | (Expression)
        const parseFactor = (): any => {
            const token = consume();
            if (token.type === 'NUMBER') {
                return { type: 'Literal', value: token.value };
            }
            if (token.type === 'VARIABLE') {
                return { type: 'Identifier', name: token.value };
            }
            if (token.type === 'FUNCTION') {
                if (peek().type !== 'LPAREN') {
                    throw new Error('Expected ( after function name');
                }
                consume(); // consume (
                const args = [];
                if (peek().type !== 'RPAREN') {
                    args.push(parseExpression());
                    while (peek().type === 'COMMA') {
                        consume(); // consume ,
                        args.push(parseExpression());
                    }
                }
                if (consume().type !== 'RPAREN') {
                    throw new Error('Expected ) after function argument');
                }
                return { type: 'CallExpression', callee: token.value, arguments: args };
            }
            if (token.type === 'LPAREN') {
                const node = parseExpression();
                if (consume().type !== 'RPAREN') {
                    throw new Error('Expected )');
                }
                return node;
            }
            throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
        };

        return parseExpression();
    };

    const normalizeName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    const evaluate = (node: any, context: Record<string, number>): number => {
        switch (node.type) {
            case 'Literal':
                return node.value;
            case 'Identifier':
                const normalizedRequested = normalizeName(node.name);
                let value: number | undefined = undefined;

                if (context[node.name] !== undefined) {
                    value = context[node.name];
                } else {
                    for (const [key, val] of Object.entries(context)) {
                        if (normalizeName(key) === normalizedRequested) {
                            value = val;
                            break;
                        }
                    }
                }

                console.log(`[useFormulaEvaluator] Resolving variable: [${node.name}] (normalized: ${normalizedRequested}) = ${value ?? 'undefined'}`);
                if (value === undefined) {
                    console.warn(`Variable not found: ${node.name}`);
                    return 0;
                }
                return value;
            case 'CallExpression':
                const argsValue = node.arguments.map((arg: any) => evaluate(arg, context));
                if (node.callee === 'ROUNDUP') return Math.ceil(argsValue[0]);
                if (node.callee === 'ROUNDDOWN') return Math.floor(argsValue[0]);
                if (node.callee === 'MAX') return Math.max(...argsValue);
                if (node.callee === 'MIN') return Math.min(...argsValue);
                throw new Error(`Unknown function: ${node.callee}`);
            case 'BinaryExpression':
                const left = evaluate(node.left, context);
                const right = evaluate(node.right, context);
                switch (node.operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return right === 0 ? 0 : left / right;
                }
        }
        return 0;
    };

    const evaluateExpression = (expression: string, context: Record<string, number>): number => {
        if (!expression) return 0;
        try {
            console.log(`[useFormulaEvaluator] Evaluating expression: "${expression}"`);
            const tokens = tokenize(expression);
            const ast = parse(tokens);
            const result = evaluate(ast, context);
            console.log(`[useFormulaEvaluator] Result: ${result}`);
            return result;
        } catch (e) {
            console.error('AST Evaluation Error:', e);
            return 0;
        }
    };

    const extractPlaceholders = (expression: string): string[] => {
        const regex = /\[([^\]]+)\]/g;
        const matches = expression.matchAll(regex);
        return [...new Set(Array.from(matches, m => m[1]))];
    };

    return {
        evaluateExpression,
        extractPlaceholders
    };
};
