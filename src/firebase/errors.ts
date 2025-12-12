export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

const INDENT_SPACES = 2;

export class FirestorePermissionError extends Error {
  constructor(public readonly context: SecurityRuleContext) {
    const formattedContext = JSON.stringify(context, null, INDENT_SPACES);

    super(
      `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${formattedContext}`
    );

    // This is a workaround for a bug in the V8 engine that causes the stack
    // trace to be incorrect when extending the Error class.
    //
    // See: https://stackoverflow.com/questions/39433729/how-to-fix-instanceof-for-custom-error-class-in-typescript
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
