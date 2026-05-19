import type { JSX } from "react";

import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { type LexicalEditor } from "lexical";
import { useState } from "react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InsertTableDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const { dictionary } = useLocalization();
  const [rows, setRows] = useState("5");
  const [columns, setColumns] = useState("5");
  const row = Number(rows);
  const column = Number(columns);
  const isDisabled = !(
    row &&
    row > 0 &&
    row <= 500 &&
    column &&
    column > 0 &&
    column <= 50
  );

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns,
      rows,
    });

    onClose();
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="table-modal-rows">{dictionary.editor.table.rows}</Label>
        <Input
          id="table-modal-rows"
          placeholder={dictionary.editor.table.rowsPlaceholder}
          onChange={(e) => setRows(e.target.value)}
          value={rows}
          data-test-id="table-modal-rows"
          type="number"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="table-modal-columns">
          {dictionary.editor.table.columns}
        </Label>
        <Input
          id="table-modal-columns"
          placeholder={dictionary.editor.table.columnsPlaceholder}
          onChange={(e) => setColumns(e.target.value)}
          value={columns}
          data-test-id="table-modal-columns"
          type="number"
        />
      </div>
      <DialogFooter data-test-id="table-model-confirm-insert">
        <Button disabled={isDisabled} onClick={onClick}>
          {dictionary.editor.insert.confirm}
        </Button>
      </DialogFooter>
    </>
  );
}
