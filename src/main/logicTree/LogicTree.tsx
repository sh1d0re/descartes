import { useCallback } from "react";

function LogicTree(): ReactElement {
    const handleFetchDescartesFile = useCallback(async (entryKey: string) => {
        const content = await (window as any).__descartes?.getDescartesContent?.(entryKey);
        return content;
    }, []);

    const logicTree
    return <>
        <div className="documentParent">
            {Object.entries(index).map(([k, v]) => (
                <div>
                </div>
            ))}
        </div>
    </>;
}
export default LogicTree;