import { useEffect, useState } from 'react';
import './GreetingScreen.css';

type Props = {
    onDone?: () => void;
};

function GreetingScreen({ onDone }: Props) {
    const [phase, setPhase] = useState<'in' | 'visible' | 'out' | 'done'>('in');

    useEffect(() => {
        const t1 = window.setTimeout(() => {
            setPhase('visible');
            const t2 = window.setTimeout(() => {
                setPhase('out');
                const t3 = window.setTimeout(() => {
                    setPhase('done');
                    if (onDone) onDone();
                }, 200);
                (cleanupTimers as any).t3 = t3;
            }, 500);
            (cleanupTimers as any).t2 = t2;
        }, 400);

        const cleanupTimers: Record<string, number> = { t1 };
        return () => {
            Object.values(cleanupTimers).forEach(id => clearTimeout(id));
        };
    }, [onDone]);

    if (phase === 'done') return null;

    const centerLogoClass =
        phase === 'in' ? 'centerLogo fade-in' :
        phase === 'out' ? 'centerLogo fade-out' :
        'centerLogo ';

    return <>
        <img className={centerLogoClass} src="./logoWithTextJA.svg" alt="Logo"></img>
        <div className="hidePanel"></div>
    </>;
}

export default GreetingScreen;