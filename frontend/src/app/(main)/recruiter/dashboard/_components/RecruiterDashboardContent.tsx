"use client"

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js"
import { Line } from "react-chartjs-2"

import { useRecruiterDashboard } from "@/api/applications/get-recruiter-dashboard"
import UiTooltip from "@/components/ui/Tooltip"
import Checkbox from "@/components/ui/Checkbox"
import RemoteData from "@/components/ui/RemoteData"
import HighlightList from "@/components/ui/HighlightList"
import Button from "@/components/ui/Button"
import { useQueryState } from "@/lib/use-query-state"
import {
  RecruiterDashboardMetric,
  RecruiterDashboardPeriod,
  RecruiterDashboardStats,
} from "@/types/recruiter-dashboard"
import classNames from "classnames"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
)

const PERIOD_ITEMS = [
  {
    id: RecruiterDashboardPeriod.Day,
    label: "День",
  },
  {
    id: RecruiterDashboardPeriod.Week,
    label: "Неделя",
  },
  {
    id: RecruiterDashboardPeriod.Month,
    label: "Месяц",
  },
  {
    id: RecruiterDashboardPeriod.Year,
    label: "Год",
  },
] as const

const PERIOD_IDS = PERIOD_ITEMS.map((item) => item.id)
const INCLUDE_INVITATIONS_VALUES = ["false", "true"] as const

const timelineFormatters = {
  [RecruiterDashboardPeriod.Day]: new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
  }),
  [RecruiterDashboardPeriod.Week]: new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
  }),
  [RecruiterDashboardPeriod.Month]: new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
  }),
  [RecruiterDashboardPeriod.Year]: new Intl.DateTimeFormat("ru-RU", {
    month: "short",
  }),
} satisfies Record<RecruiterDashboardPeriod, Intl.DateTimeFormat>

const placeholderFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
})

const placeholderLabels = Array.from({ length: 8 }, (_, index) =>
  placeholderFormatter.format(
    new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000),
  ),
)

const placeholderData = [18, 22, 16, 28, 25, 31, 24, 35]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        color: "#d7d2cc",
      },
    },
    tooltip: {
      backgroundColor: "rgba(16, 16, 16, 0.96)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      titleColor: "#fff8f0",
      bodyColor: "#f2ede6",
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
      ticks: {
        color: "#9f978c",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
      ticks: {
        precision: 0 as const,
        color: "#9f978c",
      },
    },
  },
}

const getMetricTone = (metric: RecruiterDashboardMetric) => {
  if (metric.trend === "up") {
    return "text-emerald-300"
  }

  if (metric.trend === "down") {
    return "text-rose-300"
  }

  return "text-secondary-light"
}

const formatMetricDelta = (metric: RecruiterDashboardMetric) => {
  if (!metric.delta) {
    return "Без изменений"
  }

  const sign = metric.delta > 0 ? "+" : ""
  const percent =
    metric.deltaPercent !== null
      ? ` (${metric.deltaPercent > 0 ? "+" : ""}${metric.deltaPercent}%)`
      : ""

  return `${sign}${metric.delta}${percent}`
}

const StatsCard = ({
  title,
  metric,
  extra,
}: {
  title: string
  metric?: RecruiterDashboardMetric
  extra?: string
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 w-full rounded bg-secondary">
      <p className="text-sm text-secondary-light">{title}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[40px] leading-none font-medium text-fg-heading">
          {metric?.value ?? extra}
        </p>
        {!!metric?.delta && (
          <UiTooltip content="Относительно прошлого периода">
            <p
              className={classNames({
                "text-success": metric.delta > 0,
                "text-danger": metric.delta < 0,
              })}
            >
              {formatMetricDelta(metric)}
            </p>
          </UiTooltip>
        )}
      </div>
    </div>
  )
}

const RecruiterDashboardCharts = ({
  stats,
}: {
  stats: RecruiterDashboardStats
}) => {
  const labels = stats.timeline.map((bucket) =>
    timelineFormatters[stats.period.key].format(new Date(bucket.bucketStart)),
  )

  const timelineData = {
    labels,
    datasets: [
      {
        label: stats.period.includeInvitations ? "Процессы" : "Отклики",
        data: stats.timeline.map((bucket) => bucket.responses),
        borderColor: "#f6c177",
        backgroundColor: "rgba(246, 193, 119, 0.12)",
        fill: true,
        tension: 0.35,
      },
      {
        label: "Принятые",
        data: stats.timeline.map((bucket) => bucket.accepted),
        borderColor: "#7dd3a4",
        backgroundColor: "rgba(125, 211, 164, 0.08)",
        tension: 0.35,
      },
      {
        label: "Отклонённые",
        data: stats.timeline.map((bucket) => bucket.rejected),
        borderColor: "#f38ba8",
        backgroundColor: "rgba(243, 139, 168, 0.08)",
        tension: 0.35,
      },
    ],
  }

  const viewsPlaceholderChartData = {
    labels: placeholderLabels,
    datasets: [
      {
        label: "Просмотры",
        data: placeholderData,
        borderColor: "rgba(122, 162, 247, 0.95)",
        backgroundColor: "rgba(122, 162, 247, 0.18)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
      <section className="">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">Динамика по периодам</h2>
        </div>
        <div className="mt-2 h-[320px]">
          <Line data={timelineData} options={chartOptions} />
        </div>
      </section>

      <section className="">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">Просмотры вакансий</h2>
        </div>
        <div className="relative mt-2 h-[320px] overflow-hidden border border-border/70 rounded-[24px]">
          <div className="pointer-events-none h-full blur-sm">
            <Line data={viewsPlaceholderChartData} options={chartOptions} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(12,12,12,0.38)] px-6 text-center backdrop-blur-[16px]">
            <p className="text-secondary-light">
              Статистика просмотров добавится позже
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

const RecruiterDashboardTopVacancies = ({
  stats,
}: {
  stats: RecruiterDashboardStats
}) => {
  return (
    <section className="">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3">Топ вакансий</h2>
      </div>
      <div className="mt-2 overflow-hidden rounded-[24px] border border-border">
        <div className="grid grid-cols-[minmax(0,2fr)_repeat(5,minmax(88px,1fr))] gap-3 border-b border-border bg-[rgba(255,255,255,0.03)] px-3 py-2 text-xs uppercase tracking-[0.14em] text-secondary-light">
          <p>Вакансия</p>
          <p>{stats.period.includeInvitations ? "Процессы" : "Отклики"}</p>
          <p>Приняты</p>
          <p>Отклонены</p>
          <p>В процессе</p>
          <p>Конверсия</p>
        </div>

        {stats.topVacancies.length ? (
          stats.topVacancies.map((vacancy) => (
            <div
              key={vacancy.vacancyId}
              className="grid grid-cols-[minmax(0,2fr)_repeat(5,minmax(88px,1fr))] gap-3 border-b border-border px-3 py-2 last:border-b-0"
            >
              <div>
                <p className="font-medium text-fg-heading">{vacancy.title}</p>
              </div>
              <p>{vacancy.responses}</p>
              <p>{vacancy.accepted}</p>
              <p>{vacancy.rejected}</p>
              <p>{vacancy.pending}</p>
              <p>{vacancy.conversionPercent}%</p>
            </div>
          ))
        ) : (
          <p className="px-5 py-10 text-center text-secondary-light">
            За выбранный период по вакансиям пока нет событий для статистики.
          </p>
        )}
      </div>
    </section>
  )
}

export default function RecruiterDashboardContent() {
  const [period, setPeriod] = useQueryState(
    "period",
    PERIOD_IDS,
    RecruiterDashboardPeriod.Month,
  )
  const [includeInvitationsValue, setIncludeInvitationsValue] = useQueryState(
    "includeInvitations",
    INCLUDE_INVITATIONS_VALUES,
    "false",
  )
  const includeInvitations = includeInvitationsValue === "true"

  const stats = useRecruiterDashboard({ period, includeInvitations })

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <h1 className="text-h1">Статистика по вашим вакансиям</h1>

        <div className="flex items-center gap-3">
          <HighlightList.Root
            className="flex flex-row border border-border p-1 rounded shrink-0"
            highlightClassName="bg-primary"
          >
            {PERIOD_ITEMS.map((item) => (
              <HighlightList.Item
                key={item.id}
                className="py-1 px-2 shrink-0 transition-all hover:text-fg-heading"
                active={period === item.id}
                activeClassName="text-fg-heading"
              >
                <Button type="base" onClick={() => setPeriod(item.id)}>
                  {item.label}
                </Button>
              </HighlightList.Item>
            ))}
          </HighlightList.Root>

          <Checkbox
            value={includeInvitations}
            onChange={(value) =>
              setIncludeInvitationsValue(value ? "true" : "false")
            }
          >
            <span className="text-sm text-fg-heading">
              Учитывать приглашения
            </span>
          </Checkbox>
        </div>
      </div>

      <RemoteData
        data={stats}
        onSuccess={(stats) => (
          <>
            <div className="flex gap-4">
              <StatsCard
                title={includeInvitations ? "Новые процессы" : "Новые отклики"}
                metric={stats.summary.responses}
              />
              <StatsCard title="Принятые" metric={stats.summary.accepted} />
              <StatsCard title="Отклонённые" metric={stats.summary.rejected} />
              <StatsCard
                title="Сейчас в процессе"
                extra={String(stats.summary.pendingCurrent.value)}
              />
            </div>

            <RecruiterDashboardCharts stats={stats} />
            <RecruiterDashboardTopVacancies stats={stats} />
          </>
        )}
      />
    </div>
  )
}
