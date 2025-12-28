import { useCallback, useEffect, useMemo, useState } from "react"

import { colors } from "../../assets/styles"
import MenuBar from "../MenuBar"
import SmallModal from "../SmallModal"

import { useAuth } from "../../auth/AuthContext"
import { supabase } from "../../lib/supabase"



export default function WarehouseSelection({ lastBarColor, onWarehouseSelect, onClose, selectedWarehouseId }) {

    const { user } = useAuth()

    const [warehouses, setWarehouses] = useState([])
    const [loadingWarehouses, setLoadingWarehouses] = useState(false)

    const [connectedWarehouseId, setConnectedWarehouseId] = useState(selectedWarehouseId ?? null)

    const [showCreateWarehouse, setShowCreateWarehouse] = useState(false)
    const [warehouseName, setWarehouseName] = useState("")
    const [createLoading, setCreateLoading] = useState(false)
    const [createError, setCreateError] = useState("")

    const loadWarehouses = useCallback(async () => {
        if (!user?.id) {
            setWarehouses([])
            return []
        }

        setLoadingWarehouses(true)
        try {
            const { data, error } = await supabase
                .from("warehouses")
                .select("id, name, created_at")
                .eq("created_by", user.id)
                .order("created_at", { ascending: false })

            if (error) throw error

            const next = data ?? []
            setWarehouses(next)
            return next
        } catch (e) {
            console.warn("loadWarehouses failed:", e)
            setWarehouses([])
            return []
        } finally {
            setLoadingWarehouses(false)
        }
    }, [user?.id])

    useEffect(() => {
        loadWarehouses()
    }, [loadWarehouses])

    const connectedWarehouse = useMemo(() => {
        if (!warehouses.length) return null
        return warehouses.find((w) => w.id === connectedWarehouseId) ?? warehouses[0]
    }, [warehouses, connectedWarehouseId])

    useEffect(() => {
        if (selectedWarehouseId && selectedWarehouseId !== connectedWarehouseId) {
            setConnectedWarehouseId(selectedWarehouseId)
        }
    }, [selectedWarehouseId, connectedWarehouseId])

    useEffect(() => {
        if (!connectedWarehouseId && warehouses.length) {
            const first = warehouses[0]
            setConnectedWarehouseId(first.id)
            onWarehouseSelect?.(first)
        }
    }, [connectedWarehouseId, warehouses, onWarehouseSelect])

    const menuItems = useMemo(() => {
        const currentLabel = connectedWarehouse?.name || (loadingWarehouses ? "Loading..." : "No other warehouse")
        const rest = warehouses.filter((w) => w.id !== connectedWarehouse?.id)

        return [
            {
                key: "current",
                label: currentLabel,
                icon: { name: "folder-outline", color: colors.brandHighlight },
                textStyle: { color: colors.brandHighlight },
            },
            ...rest.map((w) => ({
                key: w.id,
                label: w.name,
                icon: { name: "sync-outline", color: "white" },
                onPress: () => {
                    setConnectedWarehouseId(w.id)
                    onWarehouseSelect?.(w)
                    onClose?.()
                },
            })),
            {
                key: "new",
                label: "Create new warehouse",
                icon: { name: "add-circle-outline", color: "white" },
                backgroundColor: lastBarColor || "#333333",
                onPress: () => setShowCreateWarehouse(true),
            },
        ]
    }, [connectedWarehouse, loadingWarehouses, warehouses, lastBarColor, onClose, onWarehouseSelect])

    const onCreateWarehouse = async () => {
        setCreateError("")
        const name = warehouseName.trim()

        if (!name) {
            setCreateError("Please enter a warehouse name.")
            return
        }

        setCreateLoading(true)
        try {
            const { error } = await supabase.from("warehouses").insert({ name, created_by: user.id })
            if (error) throw error

            setShowCreateWarehouse(false)
            setWarehouseName("")

            const next = await loadWarehouses()
            setConnectedWarehouseId(next?.[0]?.id ?? null)
        } catch (e) {
            setCreateError(e?.message ?? "Failed to create warehouse.")
        } finally {
            setCreateLoading(false)
        }
    }

    return (
        <>
            <MenuBar items={menuItems} />
            <SmallModal
                visible={showCreateWarehouse}
                onClose={() => setShowCreateWarehouse(false)}
                title="Create Warehouse"
                inputTitle="Warehouse name"
                value={warehouseName}
                onChangeText={(t) => {
                    setWarehouseName(t)
                    if (createError) setCreateError("")
                }}
                submitText="Create"
                onSubmit={onCreateWarehouse}
                loading={createLoading}
                error={createError}
            />
        </>
    )
}