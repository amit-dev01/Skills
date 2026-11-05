"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Check } from "lucide-react";

export function ConnectionNoteModal({ isOpen, onClose, connection, onSaveNote }) {
  const [notes, setNotes] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (connection) {
      setNotes(connection.notes || "");
    }
  }, [connection]);

  const handleSave = () => {
    if (connection) {
      onSaveNote(connection.entityId || connection.id, notes);
      addToast("Connection notes saved!", "success");
      onClose();
    }
  };

  if (!connection) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Outreach Notes: ${connection.entityName}`}
      description="Record key conversation points, follow-up dates, and draft snippets."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Personal Notes & Activity
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Sent personalized InMail on Nov 5. Mentioned our shared interest in Next.js 15. Follow up next Tuesday if no response."
            rows={5}
            className="text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Check className="w-4 h-4" />
            <span>Save Notes</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
