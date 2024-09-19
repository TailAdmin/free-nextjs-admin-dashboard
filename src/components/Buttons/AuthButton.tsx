"use client"
import React from 'react'
import { UserRepository } from "@repo/domain/UserRepository";

const repository = new UserRepository();

async function adminSignIn(email: string, password: string) {
  await repository.signIn(email, password)
  // window.location.reload()
};

async function adminSignOut() {
  await repository.signOut()
  // window.location.reload()
}

type AuthButtonProps = {
    className?: string
    password?: string
    email?: string
    authButtonText?: string
}

export const AuthButton = ({className, password, email, authButtonText}: AuthButtonProps) => {
  return (
    <button className={className} onClick={password && email ? () => adminSignIn(email, password) : () => adminSignOut()}>
      {authButtonText ? authButtonText : "Admin Sign In"}
    </button>
  )
}
