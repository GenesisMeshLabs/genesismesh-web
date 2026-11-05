import status from "@/content/vision/status.json";
import { reviewNotes, visionReview, visionSources as sources } from "@/content/vision/sources";
import { Copy, SourceLinks, TextList, VisionSection } from "./section";

const rowSources = [sources.treaties, sources.claims, sources.treaties, sources.delegation, sources.grants, sources.oversight, sources.connect];

export function VisionStatus() {
  return <VisionSection {...status}>
    <Copy>{status.description}</Copy>
    <p className="text-sm text-ink-400">Evidence snapshot: {visionReview.displayDate}. Core {visionReview.coreVersion}, commit <a className="vision-source font-mono" href={`https://github.com/GenesisMeshLabs/genesismesh/commit/${visionReview.coreCommit}`}>{visionReview.coreCommit.slice(0, 7)}</a>. Connect and MCP have their own release and dependency versions.</p>
    <div className="vision-status-table surface-card">
      <table>
        <caption className="sr-only">Reviewed current capabilities and remaining work, as of {visionReview.displayDate}</caption>
        <thead><tr><th scope="col">Area</th><th scope="col">Supported in core {visionReview.coreVersion} / current integration</th><th scope="col">Not yet / limits</th></tr></thead>
        <tbody>{status.rows.map((row, index) => <tr key={row.area}>
          <th scope="row"><a className="vision-source" href={rowSources[index].href}>{row.area}<span aria-hidden="true"> ↗</span></a></th>
          <td><span className="vision-mobile-label" aria-hidden="true">Supported</span>{row.supported}</td>
          <td><span className="vision-mobile-label" aria-hidden="true">Not yet / limits</span>{row.remaining}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <Copy>{status.note}</Copy>
    <SourceLinks sources={[sources.interoperability, sources.sdkTypescript, sources.sdkGo, sources.sdkRust, sources.sdkDotnet, sources.mcp]} />
    <SourceLinks sources={[sources.spiffe, sources.vc, sources.jwt]} />
    <details className="vision-details soft-card">
      <summary>What the source review clarified</summary>
      <div className="space-y-6 px-6 pb-6">
        <TextList items={reviewNotes} />
        <SourceLinks sources={[sources.grants, sources.oversight, sources.gateway]} />
      </div>
    </details>
  </VisionSection>;
}
