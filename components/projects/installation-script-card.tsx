"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

type InstallationScriptCardProps = {
  widgetPublicKey: string;
};

const InstallationScriptCard = ({
  widgetPublicKey,
}: InstallationScriptCardProps) => {
  const [copied, setCopied] = useState(false);

  const script = useMemo(() => {
    return `<script
  src="https://cdn.pageloop.app/widget.js"
  data-project="${widgetPublicKey}">
</script>`;
  }, [widgetPublicKey]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-xl border bg-background p-5">
      <h2 className="font-semibold">Install widget</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Copy and paste this script before the closing body tag on your website.
      </p>

      <pre className="mt-4 overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm">
        <code>{script}</code>
      </pre>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy script
          </>
        )}
      </button>
    </div>
  );
};

export default InstallationScriptCard;