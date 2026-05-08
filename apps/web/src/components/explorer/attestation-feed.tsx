import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@prova/ui';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const MOCK = [
  { id: 'att1abc...def', agent: 'AgPDA1...xyz', type: 'Transaction', ts: '2026-05-08 14:32' },
  { id: 'att2def...ghi', agent: 'AgPDA2...abc', type: 'ToolCall', ts: '2026-05-08 14:28' },
  { id: 'att3ghi...jkl', agent: 'AgPDA1...xyz', type: 'Decision', ts: '2026-05-08 14:21' },
  { id: 'att4jkl...mno', agent: 'AgPDA3...def', type: 'ModelInvocation', ts: '2026-05-08 14:15' },
];

const typeVariant: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
  Transaction: 'default',
  ToolCall: 'secondary',
  Decision: 'warning',
  ModelInvocation: 'success',
};

export function AttestationFeed() {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-6 py-4">
        <h2 className="font-semibold text-white">Recent Attestations</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Attestation ID</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK.map((att) => (
            <TableRow key={att.id}>
              <TableCell>
                <Link href={`/explorer/attestation/${att.id}`} className="font-mono text-xs text-primary hover:underline">
                  {att.id}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/explorer/agent/${att.agent}`} className="font-mono text-xs text-muted-foreground hover:text-white">
                  {att.agent}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={typeVariant[att.type] ?? 'default'}>{att.type}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{att.ts}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-sm text-green-400">
                  <CheckCircle className="h-3.5 w-3.5" /> Verified
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
