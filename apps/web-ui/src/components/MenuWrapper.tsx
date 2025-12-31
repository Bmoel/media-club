import type { ReactElement } from "react";
import MenuBar from "./common/MenuBar";

interface MenuWrapperProps {
    children: ReactElement
}

function MenuWrapper({ children }: MenuWrapperProps) {
    return (
        <>
            <MenuBar />
            {children}
        </>
    );
}

export default MenuWrapper;