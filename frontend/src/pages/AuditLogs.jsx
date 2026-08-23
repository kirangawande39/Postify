import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { getAuditLogs } from "../services/authService";

const AUDIT_ADMIN_USER_ID =
    import.meta.env.VITE_AUDIT_ADMIN_USER_ID;

const MODULES = [
    "ALL",
    "AUTH",
    "PASSWORD",
    "USER",
    "POST",
    "COMMENT",
    "LIKE",
    "FOLLOW",
    "FOLLOW_REQUEST",
    "MESSAGE",
    "GROUP",
    "STORY",
    "CHAT",
    "CALL",
    "SYSTEM",
];

const AuditLogs = ({ user }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedLog, setSelectedLog] = useState(null);

    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("ALL");
    const [actionFilter, setActionFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [sortOrder, setSortOrder] = useState("newest");

    const fetchAuditLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getAuditLogs();

            setLogs(res?.data?.logs || []);
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch audit logs."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.id === AUDIT_ADMIN_USER_ID) {
            fetchAuditLogs();
        } else {
            setLoading(false);
        }
    }, [user?.id, fetchAuditLogs]);

    const actions = useMemo(() => {
        const uniqueActions = [
            ...new Set(
                logs
                    .map((log) => log.action)
                    .filter(Boolean)
            ),
        ];

        return ["ALL", ...uniqueActions.sort()];
    }, [logs]);

    const filteredLogs = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        const result = logs.filter((log) => {
            const target =
                log?.targetId &&
                typeof log.targetId === "object"
                    ? log.targetId
                    : null;

            const targetText = target
                ? JSON.stringify(target).toLowerCase()
                : String(log?.targetId || "").toLowerCase();

            const matchesSearch =
                !searchText ||
                log?.actor?.username
                    ?.toLowerCase()
                    .includes(searchText) ||
                log?.actor?.email
                    ?.toLowerCase()
                    .includes(searchText) ||
                log?.actorEmail
                    ?.toLowerCase()
                    .includes(searchText) ||
                log?.description
                    ?.toLowerCase()
                    .includes(searchText) ||
                log?.action
                    ?.toLowerCase()
                    .includes(searchText) ||
                log?.module
                    ?.toLowerCase()
                    .includes(searchText) ||
                log?.targetType
                    ?.toLowerCase()
                    .includes(searchText) ||
                targetText.includes(searchText);

            const matchesModule =
                moduleFilter === "ALL" ||
                log.module === moduleFilter;

            const matchesAction =
                actionFilter === "ALL" ||
                log.action === actionFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "SUCCESS" &&
                    log.success === true) ||
                (statusFilter === "FAILED" &&
                    log.success === false);

            return (
                matchesSearch &&
                matchesModule &&
                matchesAction &&
                matchesStatus
            );
        });

        return result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            return sortOrder === "newest"
                ? dateB - dateA
                : dateA - dateB;
        });
    }, [
        logs,
        search,
        moduleFilter,
        actionFilter,
        statusFilter,
        sortOrder,
    ]);

    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const clearFilters = () => {
        setSearch("");
        setModuleFilter("ALL");
        setActionFilter("ALL");
        setStatusFilter("ALL");
        setSortOrder("newest");
    };

    const getActorName = (log) => {
        return (
            log?.actor?.username ||
            log?.actor?.name ||
            log?.actorEmail ||
            "Unknown"
        );
    };

    const getActorEmail = (log) => {
        return (
            log?.actorEmail ||
            log?.actor?.email ||
            "-"
        );
    };

    const getTarget = (log) => {
        if (
            log?.targetId &&
            typeof log.targetId === "object"
        ) {
            return log.targetId;
        }

        return null;
    };

    const getTargetId = (log) => {
        if (
            log?.targetId &&
            typeof log.targetId === "object"
        ) {
            return log.targetId?._id || "-";
        }

        return log?.targetId || "-";
    };

    if (user?.id !== AUDIT_ADMIN_USER_ID) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:ml-[235px] lg:px-8">
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                            <span className="text-3xl">
                                🚫
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">
                            Access Denied
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            You are not authorized to access
                            the Audit Logs.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:ml-[235px] lg:px-8">

            <div className="mx-auto w-full max-w-[1400px]">

                {/* HEADER */}

                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Audit Logs
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Monitor and review important activities performed in VibeNet.
                        </p>
                    </div>

                    <button
                        onClick={fetchAuditLogs}
                        disabled={loading}
                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                    >
                        {loading
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>
                </div>

                {/* STATS */}

                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Logs
                        </p>

                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {logs.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Successful
                        </p>

                        <p className="mt-3 text-3xl font-bold text-emerald-600">
                            {
                                logs.filter(
                                    (log) =>
                                        log.success === true
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Failed
                        </p>

                        <p className="mt-3 text-3xl font-bold text-red-600">
                            {
                                logs.filter(
                                    (log) =>
                                        log.success === false
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* FILTERS */}

                <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">

                        <input
                            type="text"
                            placeholder="Search audit logs..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />

                        <select
                            value={moduleFilter}
                            onChange={(e) =>
                                setModuleFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none"
                        >
                            {MODULES.map((module) => (
                                <option
                                    key={module}
                                    value={module}
                                >
                                    {module === "ALL"
                                        ? "All Modules"
                                        : module}
                                </option>
                            ))}
                        </select>

                        <select
                            value={actionFilter}
                            onChange={(e) =>
                                setActionFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none"
                        >
                            {actions.map((action) => (
                                <option
                                    key={action}
                                    value={action}
                                >
                                    {action === "ALL"
                                        ? "All Actions"
                                        : action}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none"
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="SUCCESS">
                                Success
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) =>
                                setSortOrder(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none"
                        >
                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>
                        </select>
                    </div>

                    <div className="mt-4 flex items-center justify-between">

                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredLogs.length}
                            </span>{" "}
                            logs
                        </p>

                        <button
                            onClick={clearFilters}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* LOADING */}

                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

                            <p className="text-sm text-slate-500">
                                Loading audit logs...
                            </p>
                        </div>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                        <div className="text-center">
                            <div className="text-4xl">
                                📋
                            </div>

                            <h3 className="mt-4 font-semibold text-slate-900">
                                No audit logs found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your filters.
                            </p>
                        </div>
                    </div>
                ) : (

                    /* AUDIT LIST */

                    <div className="space-y-3">

                        {filteredLogs.map((log) => {

                            const target = getTarget(log);

                            return (
                                <button
                                    key={log._id}
                                    onClick={() =>
                                        setSelectedLog(log)
                                    }
                                    className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                                >

                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                                    {log.module}
                                                </span>

                                                <span className="font-bold text-slate-900">
                                                    {log.action}
                                                </span>

                                                {log.success ? (
                                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        Success
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                                        Failed
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-2 text-sm text-slate-600">
                                                {log.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">

                                                <span>
                                                    👤{" "}
                                                    {getActorName(log)}
                                                </span>

                                                <span>
                                                    🕒{" "}
                                                    {formatDate(
                                                        log.createdAt
                                                    )}
                                                </span>

                                                {log.targetType && (
                                                    <span>
                                                        🎯{" "}
                                                        {log.targetType}
                                                    </span>
                                                )}

                                                {target && (
                                                    <span>
                                                        Target:{" "}
                                                        {target.username ||
                                                            target.name ||
                                                            target.email ||
                                                            target.title ||
                                                            target._id}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-sm font-semibold text-slate-400 transition group-hover:text-slate-900">
                                            View Details →
                                        </div>

                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* DETAIL MODAL */}

            {selectedLog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setSelectedLog(null)
                    }
                >
                    <div
                        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Audit Log
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {selectedLog.action}
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedLog(null)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6 p-6">

                            {/* BASIC INFO */}

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-slate-900">
                                    Basic Information
                                </h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <Detail
                                        label="Module"
                                        value={selectedLog.module}
                                    />

                                    <Detail
                                        label="Action"
                                        value={selectedLog.action}
                                    />

                                    <Detail
                                        label="Status"
                                        value={
                                            selectedLog.success
                                                ? "Success"
                                                : "Failed"
                                        }
                                    />

                                    <Detail
                                        label="Date & Time"
                                        value={formatDate(
                                            selectedLog.createdAt
                                        )}
                                    />
                                </div>
                            </div>

                            {/* ACTOR */}

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-slate-900">
                                    Actor
                                </h3>

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <Detail
                                            label="Username"
                                            value={
                                                selectedLog.actor
                                                    ?.username ||
                                                "-"
                                            }
                                        />

                                        <Detail
                                            label="Email"
                                            value={
                                                selectedLog.actor
                                                    ?.email ||
                                                selectedLog.actorEmail ||
                                                "-"
                                            }
                                        />

                                        <Detail
                                            label="Actor ID"
                                            value={
                                                selectedLog.actor
                                                    ?._id ||
                                                "-"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* TARGET */}

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-slate-900">
                                    Target
                                </h3>

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <Detail
                                            label="Target Type"
                                            value={
                                                selectedLog.targetType ||
                                                "-"
                                            }
                                        />

                                        <Detail
                                            label="Target ID"
                                            value={getTargetId(
                                                selectedLog
                                            )}
                                        />
                                    </div>

                                    {getTarget(selectedLog) && (
                                        <div className="mt-4 border-t border-slate-200 pt-4">

                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Populated Target
                                            </p>

                                            <pre className="max-h-72 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-6 text-slate-100">
                                                {JSON.stringify(
                                                    getTarget(
                                                        selectedLog
                                                    ),
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DESCRIPTION */}

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-slate-900">
                                    Description
                                </h3>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                                    {selectedLog.description ||
                                        "-"}
                                </div>
                            </div>

                            {/* REQUEST */}

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-slate-900">
                                    Request Information
                                </h3>

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <div className="grid grid-cols-1 gap-4">

                                        <Detail
                                            label="IP Address"
                                            value={
                                                selectedLog.ipAddress ||
                                                "-"
                                            }
                                        />

                                        <div>
                                            <p className="text-xs font-medium text-slate-400">
                                                User Agent
                                            </p>

                                            <p className="mt-1 break-all text-sm text-slate-700">
                                                {selectedLog.userAgent ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* METADATA */}

                            <div>
                                <h3 className="mb-3 text-sm font-bold text-slate-900">
                                    Metadata
                                </h3>

                                <pre className="max-h-72 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-6 text-slate-100">
                                    {JSON.stringify(
                                        selectedLog.metadata ||
                                            {},
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>

                            {/* AUDIT ID */}

                            <div className="border-t border-slate-200 pt-5">

                                <Detail
                                    label="Audit Log ID"
                                    value={
                                        selectedLog._id
                                    }
                                />

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Detail = ({ label, value }) => {
    return (
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-slate-700">
                {value || "-"}
            </p>
        </div>
    );
};

export default AuditLogs;