import { useFields } from "hooks";
import { brand } from "lib/config/brand";
import { RefObject } from "react";

import { MemberSpotlight, MemberSpotlightProps } from "./MemberSpotlight";
import { ModalPopup } from "./Modal";

export type MemberModalProps = MemberSpotlightProps & {
  memberId: string
  isOpen?: boolean
  onClose?: () => void
  full?: boolean
  updateMeta?: boolean
  ref?: RefObject<Element & { focus: () => null }>
  children?: React.ReactNode
}

export function MemberModal({
  memberId,
  isOpen = false,
  onClose,
  ref,
  full = true,
  updateMeta = false,
  size = 'lg',
  children,
  ...props
}: MemberModalProps) {
  const { fields, loading } = useFields('users')

  if (loading) return null
  return (
    <>
      <ModalPopup
        size={brand.breakPoints}
        isOpen={isOpen}
        onClose={onClose}
        returnFocusOnClose={ref != undefined}
        finalFocusRef={ref}
      >
        {memberId && fields && (
          <MemberSpotlight
            memberId={memberId}
            fields={fields}
            full={full}
            updateMeta={updateMeta}
            size={size}
            {...props}
          >
            {children}
          </MemberSpotlight>
        )}
      </ModalPopup>
    </>
  )
}
