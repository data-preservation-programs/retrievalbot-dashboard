import {Pool} from "pg";

const pg = new Pool()

const distributionQuery = `
    SELECT provider,
           SUM(piece_size) AS total_deal_size
    FROM current_state
    WHERE client = ANY ($1)
      AND verified_deal = true
      AND slash_epoch < 0
      AND (sector_start_epoch > 0 AND sector_start_epoch < $2)
      AND end_epoch > $2
    GROUP BY provider
`

const locationQuery = `
    SELECT *
    FROM active_miners_v2
    WHERE "minerId" = ANY ($1)
`

function getCurrentEpoch(): number {
    return Math.floor((Date.now() / 1000 - 1598306400) / 30)
}

export interface ProviderDistribution {
    provider: string
    total_deal_size: string
}

export interface ProviderLocation {
    minerId: string
    ipinfoCity: string
    ipinfoRegion: string
    ipinfoCountry: string
    ipinfoLatitude: number
    ipinfoLongitude: number
    ipinfoOrg: string
    ipinfoHostname: string
}

export async function getProviderDistribution(clients: string[]): Promise<ProviderDistribution[]> {
    const currentEpoch = getCurrentEpoch()
    const result = await pg.query(distributionQuery, [clients, currentEpoch])
    return result.rows as ProviderDistribution[]
}

export async function getProviderLocation(providers: string[]): Promise<ProviderLocation[]> {
    const result = await pg.query(locationQuery, [providers])
    return result.rows as ProviderLocation[]
}
