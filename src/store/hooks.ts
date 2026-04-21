import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "./index"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

/**
 * RTK Query hooks are auto-generated and exported from the API slice
 * and endpoint files. Import them from their respective files:
 * 
 * Example:
 * import { useGetEnergyDataQuery } from "@/store/endpoints/energyApi"
 */
