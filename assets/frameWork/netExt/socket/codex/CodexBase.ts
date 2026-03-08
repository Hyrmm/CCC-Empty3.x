export abstract class CodexBase<TSend, TReceive> {
    public abstract encode(payload: TSend): TransportPayload;
    public abstract decode(payload: TransportPayload): TReceive;
} 