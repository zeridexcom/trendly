'use client'

import { motion } from 'framer-motion'
import CommandPalette from '@/components/CommandPalette'

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CommandPalette />
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
            >
                {children}
            </motion.div>
        </>
    )
}
