"use client";

import { useActionState } from "react";
import { firmarRemotoAction, type FirmaRemotaState } from "@/lib/consentimientos/actions";
import { SignaturePad } from "@/components/shared/signature-pad";

const initialState: FirmaRemotaState = {};

export function FirmaRemotaForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(firmarRemotoAction, initialState);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-700">
        <p className="font-semibold">¡Gracias! Tu firma quedó registrada correctamente.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <SignaturePad name="firmaPacienteBase64" label="Tu firma" />
      {state.error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="brand-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Firmar y enviar"}
      </button>
    </form>
  );
}
