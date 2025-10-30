import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import './ImportBox.css';

type IndexEntry = {
    fileDirectory: string;
    description: string;
    addedAt: string;
    lastInteractedAt: string;
};

function ReadableDate(d: string) {
    return d;
}

function ValidDocumentType(filePath: string) {
    const allow = ['.txt', '.docx', '.md', '.pdf', '.doc'];
    const ext = (filePath.match(/\.[^.]+$/)?.[0] || '').toLowerCase();
    return allow.includes(ext);
}

export default function ImportBox(): ReactElement {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [hover, setHover] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageDanger, setMessageDanger] = useState<boolean>(false);
    const [index, setIndex] = useState<Record<string, IndexEntry>>({});

    const showTempMessage = useCallback((txt: string, danger = false) => {
        setMessage(txt);
        setMessageDanger(danger);
        window.setTimeout(() => setMessage(null), 5000);
    }, []);

    const refreshIndex = useCallback(async () => {
        const res = await (window as any).__descartes?.getIndex?.();
        if (res?.ok) setIndex(res.index || {});
    }, []);

    useEffect(() => { refreshIndex(); }, [refreshIndex]);

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const f = files[0] as any;
        const srcPath: string = f.path;
        if (!srcPath) {
            const file = f as File;
            const ab = await file.arrayBuffer();
            const res = await (window as any).__descartes?.importFileFromBuffer?.(file.name, ab);
            // handle res
        }

        if (!ValidDocumentType(srcPath)) { showTempMessage('This filetype is not accepted', true); return; }

        const res = await (window as any).__descartes?.importFile?.(srcPath);
        if (res?.ok) { showTempMessage('Imported successfully', false); await refreshIndex(); }
        else { showTempMessage('Import failed: ' + (res?.error || 'unknown'), true); }
    }, [refreshIndex, showTempMessage]);

    const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setHover(false); handleFiles(e.dataTransfer?.files ?? null); }, [handleFiles]);
    const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setHover(true); }, []);
    const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setHover(false); }, []);

    const onClick = useCallback(async () => {
        const chosen = await (window as any).__descartes?.openFileDialog?.();
        if (chosen) await handleFilePath(chosen);
    }, []);

    async function handleFilePath(srcPath: string) {
        if (!ValidDocumentType(srcPath)) {
            showTempMessage('This filetype is not accepted', true); return; 
        }
        const res = await (window as any).__descartes?.importFile?.(srcPath);
        if (res?.ok) {
            showTempMessage('Imported successfully', false); await refreshIndex(); 
        }
        else {
            showTempMessage('Import failed: ' + (res?.error || 'unknown'), true); 
        }
    }

    const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { handleFiles(e.target.files); e.currentTarget.value = ''; }, [handleFiles]);

    const handleDelete = useCallback(async (key: string) => {
        const res = await (window as any).__descartes?.deleteEntry?.(key);
        if (res?.ok) {
            showTempMessage('Deleted', false); setIndex(res.index || {});
        }
        else {
            showTempMessage('Delete failed', true);
        }
    }, [showTempMessage]);

    return <>
        <section>
            <div className="importScreen">
                <div
                    className={`selectionBox importDrop ${hover ? 'hover' : ''}`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={onClick}
                    role="button"
                    aria-label="Import file"
                >
                    <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={onInput} />
                    <img className="importLogo" src="import.svg" draggable={false} />
                    <p>Click or drop a file here to import</p>
                </div>
                
                {message && (
                    <div className="messageBox" style={{ border: messageDanger ? '1px solid red' : '1px solid #676767'}}>
                        <p>{message}</p>
                    </div>
                )}
                <div className="documentParent">
                    {Object.entries(index).map(([k, v]) => (
                        <div key={k} className="documentBox">
                            <img className="clickableLogo documentLogo" src="document.svg" draggable={false} />
                            <p>{k}</p>
                            <p>{v.description || 'No description'}</p>
                            <p>Added at: {ReadableDate(v.addedAt)}</p>
                            <p>Last interacted at: {ReadableDate(v.lastInteractedAt)}</p>
                            <img className="clickableLogo deleteLogo" src="delete.svg" onClick={() => handleDelete(k)} draggable={false} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </>;
}