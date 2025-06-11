import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  const handleLogin = (userType: "admin" | "driver") => {
    login(userType, {
      email: loginData.email,
      name: userType === "admin" ? "Administrador" : "Motorista",
    })

    navigate(userType === "admin" ? "/admin" : "/driver")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
      <Card className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden shadow-xl">
        <div className="p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold text-primary">
              Acesso ao Sistema
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Entre como administrador ou motorista
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="admin">Administrador</TabsTrigger>
                <TabsTrigger value="driver">Motorista</TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@empresa.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
                <Button className="w-full" onClick={() => handleLogin("admin")}>
                  Entrar como Administrador
                </Button>
              </TabsContent>

              <TabsContent value="driver" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="driver-email">Email</Label>
                  <Input
                    id="driver-email"
                    type="email"
                    placeholder="motorista@empresa.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-password">Senha</Label>
                  <Input
                    id="driver-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleLogin("driver")}
                >
                  Entrar como Motorista
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>

        <div className="hidden md:block bg-muted p-0">
          <img
            src="./logo2.png"
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </Card>
    </div>
  )
}
