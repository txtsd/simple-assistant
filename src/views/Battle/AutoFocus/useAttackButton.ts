import { focusOnButtonEnable } from "@/utils"
import { Ref, watch } from "vue"

export function useAttackButton(shouldAutoFocusAttack: Ref<boolean>) {
  const attackButton = document.querySelector<HTMLButtonElement>(".bg-white.mt-4.rounded-md.p-8.text-center button")
  const observer = attackButton && focusOnButtonEnable(attackButton)

  watch(
    shouldAutoFocusAttack,
    (val) => {
      if (!observer) return

      if (val) observer.connect()
      else observer.disconnect()
    },
    {
      immediate: true,
    }
  )
}