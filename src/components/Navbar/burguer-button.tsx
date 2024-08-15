import React from "react";
import { useSidebarContext } from "../Layouts/layout-context";
import { StyledBurgerButton } from "./navbar.styles";

export const BurguerButton = () => {
    const { collapsed, setCollapsed } = useSidebarContext();

    return (
        <div
            className={StyledBurgerButton()}
            // open={collapsed}
            onClick={setCollapsed}
            >
            <div />
            <div />
        </div>
    );
};