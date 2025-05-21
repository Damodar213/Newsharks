"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Collection = {
  name: string
  count: number
  type: string
}

type ConnectionStatus = {
  connected: boolean
  host: string
  name: string
}

export default function DbAdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/db-status')
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch database status')
        }
        
        setCollections(data.collections || [])
        setConnectionStatus(data.connectionStatus)
      } catch (err) {
        console.error('Error fetching DB status:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDbStatus()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Database Admin</span>
          </Link>
          <div className="ml-auto">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">MongoDB Atlas Connection</h1>
        
        {isLoading ? (
          <p>Loading database information...</p>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>MongoDB Atlas connection information</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="font-medium">Status</dt>
                    <dd className={connectionStatus?.connected ? "text-green-600" : "text-red-600"}>
                      {connectionStatus?.connected ? "Connected" : "Disconnected"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Database</dt>
                    <dd>{connectionStatus?.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Host</dt>
                    <dd className="break-all">{connectionStatus?.host}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Collections</CardTitle>
                <CardDescription>MongoDB collections in your database</CardDescription>
              </CardHeader>
              <CardContent>
                {collections.length === 0 ? (
                  <p className="text-amber-600">
                    No collections found. You may need to create collections by using the application
                    or manually through MongoDB Atlas.
                  </p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left font-medium">Collection Name</th>
                          <th className="p-3 text-left font-medium">Document Count</th>
                          <th className="p-3 text-left font-medium">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collections.map((collection, index) => (
                          <tr key={collection.name} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                            <td className="p-3 border-t">{collection.name}</td>
                            <td className="p-3 border-t">{collection.count}</td>
                            <td className="p-3 border-t">{collection.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        <p>MongoDB Atlas Admin - New Sharks Platform</p>
      </footer>
    </div>
  )
} 