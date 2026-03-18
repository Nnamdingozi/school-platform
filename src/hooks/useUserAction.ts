import { useState } from 'react'
import { UserActionType } from '@/components/admin-dasboard/user-modal'

interface UserActionState {
    userId:    string
    userName:  string | null
    userEmail: string
    action:    UserActionType
}

export function useUserAction() {
    const [actionState, setActionState] = useState<UserActionState | null>(null)

    function triggerAction(
        action:    UserActionType,
        userId:    string,
        userName:  string | null,
        userEmail: string,
    ) {
        setActionState({ action, userId, userName, userEmail })
    }

    function closeAction() {
        setActionState(null)
    }

    return { actionState, triggerAction, closeAction }
}