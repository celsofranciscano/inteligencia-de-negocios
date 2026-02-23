import { db1 } from "@/lib/db1";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Stethoscope } from "lucide-react";

async function getTableData(table: string) {
  const totalResult = await db1.query(
    `SELECT COUNT(*)::int AS total FROM ${table}`,
  );

  const rowsResult = await db1.query(
    `SELECT * FROM ${table} ORDER BY 1 DESC LIMIT 100`,
  );

  return {
    total: totalResult.rows[0].total as number,
    rows: rowsResult.rows as Record<string, any>[],
  };
}

// Generar el script de INSERT para el grupo 3
function generateInsertScript(rows: Record<string, any>[]) {
  if (!rows.length) return "";

  const values = rows.map((row) => {
    const codigo_cie10 = row.codigo_cie10;
    const nombre = row.descripcion.replace(/'/g, "''"); // escapar comillas simples
    const categoria = "NULL";
    const es_cronico = "FALSE";
    const es_quirurgico = "FALSE";
    const es_infeccioso = "FALSE";

    return `('${codigo_cie10}', '${nombre}', ${categoria}, ${es_cronico}, ${es_quirurgico}, ${es_infeccioso})`;
  });

  return (
    `INSERT INTO diagnosticos (codigo_cie10, nombre, categoria, es_cronico, es_quirurgico, es_infeccioso) VALUES\n` +
    values.join(",\n") +
    ";"
  );
}

export default async function NeonCoreDashboard() {
  const diagnosticosData = await getTableData("diagnosticos");
  const insertScript = generateInsertScript(diagnosticosData.rows);

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">
        Generador de INSERTs - Diagnósticos
      </h1>

      {/* ─── Explicación de la tabla original y destino ────────────── */}
      <Card className="mb-6 border bg-background/40 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Explicación de Campos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            La tabla original <strong>diagnosticos</strong> tiene los siguientes
            campos:
          </p>
          <table className="w-full text-sm table-auto mb-4">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-3 py-1 text-left text-xs font-semibold">
                  Campo
                </th>
                <th className="px-3 py-1 text-left text-xs font-semibold">
                  Ejemplo
                </th>
                <th className="px-3 py-1 text-left text-xs font-semibold">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30 text-xs">
              <tr>
                <td className="px-3 py-1">diagnostico_id</td>
                <td className="px-3 py-1">68123</td>
                <td className="px-3 py-1">ID interno de diagnóstico</td>
              </tr>
              <tr>
                <td className="px-3 py-1">atencion_id</td>
                <td className="px-3 py-1">50000</td>
                <td className="px-3 py-1">Referencia a la atención asociada</td>
              </tr>
              <tr>
                <td className="px-3 py-1">codigo_cie10</td>
                <td className="px-3 py-1">E66.9</td>
                <td className="px-3 py-1">Código CIE-10 del diagnóstico</td>
              </tr>
              <tr>
                <td className="px-3 py-1">descripcion</td>
                <td className="px-3 py-1">Obesidad, no especificada</td>
                <td className="px-3 py-1">
                  Nombre o descripción del diagnóstico
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1">severidad</td>
                <td className="px-3 py-1">Moderada</td>
                <td className="px-3 py-1">
                  Gravedad del diagnóstico (no se usa en el grupo 3)
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mb-2 text-sm text-muted-foreground">
            En la tabla destino (Grupo 3) los campos se asignan de la siguiente
            manera:
          </p>
          <table className="w-full text-sm table-auto text-xs">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-3 py-1 text-left font-semibold">
                  Campo destino
                </th>
                <th className="px-3 py-1 text-left font-semibold">
                  Cómo se llena
                </th>
                <th className="px-3 py-1 text-left font-semibold">
                  Comentario
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              <tr>
                <td className="px-3 py-1">id_diagnostico</td>
                <td className="px-3 py-1">Nuevo UUID</td>
                <td className="px-3 py-1">
                  Se genera automáticamente, no se mantiene `diagnostico_id`
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1">codigo_cie10</td>
                <td className="px-3 py-1">Copiado de `codigo_cie10`</td>
                <td className="px-3 py-1">
                  Se mantiene igual que en tabla original
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1">nombre</td>
                <td className="px-3 py-1">Copiado de `descripcion`</td>
                <td className="px-3 py-1">
                  Se mantiene igual, se escapan comillas simples
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1">categoria</td>
                <td className="px-3 py-1">NULL</td>
                <td className="px-3 py-1">No existe en la tabla original</td>
              </tr>
              <tr>
                <td className="px-3 py-1">es_cronico</td>
                <td className="px-3 py-1">FALSE</td>
                <td className="px-3 py-1">Valor por defecto</td>
              </tr>
              <tr>
                <td className="px-3 py-1">es_quirurgico</td>
                <td className="px-3 py-1">FALSE</td>
                <td className="px-3 py-1">Valor por defecto</td>
              </tr>
              <tr>
                <td className="px-3 py-1">es_infeccioso</td>
                <td className="px-3 py-1">FALSE</td>
                <td className="px-3 py-1">Valor por defecto</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ─── Datos y script de INSERT ─────────────────────────────── */}
      <Card className="mb-6 border bg-background/40 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Stethoscope className="size-6" />
            Diagnósticos ({diagnosticosData.total} registros)
          </CardTitle>
        </CardHeader>

        <CardContent>
          {diagnosticosData.rows.length > 0 ? (
            <>
              <ScrollArea className="h-96 mb-4">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {Object.keys(diagnosticosData.rows[0]).map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2 text-left font-semibold text-xs"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/30">
                    {diagnosticosData.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-accent/20 transition-colors duration-150"
                      >
                        {Object.values(row).map((val, idx) => (
                          <td
                            key={idx}
                            className="px-4 py-2 truncate max-w-[200px]"
                          >
                            {val == null ? (
                              <span className="text-muted-foreground">—</span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>

              <ScrollArea className="h-80 border rounded p-2 bg-background/50">
                <pre className="text-xs">{insertScript}</pre>
              </ScrollArea>
            </>
          ) : (
            <div>No hay registros</div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
