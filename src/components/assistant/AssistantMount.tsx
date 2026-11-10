import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Assistant } from "./Assistant";
export function AssistantMount() {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient(),
    router = useRouter();
  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (active) setUserId(session?.user.id ?? null);
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      void router.invalidate();
      if (event === "SIGNED_OUT") queryClient.removeQueries({ queryKey: ["assistant"] });
      else void queryClient.invalidateQueries();
    });
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUserId(data.user?.id ?? null);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient, router]);
  return <Assistant userId={userId} />;
}
