import axios from 'axios';

// Action Types
export const REPORT_CREATE_REQUEST = 'REPORT_CREATE_REQUEST';
export const REPORT_CREATE_SUCCESS = 'REPORT_CREATE_SUCCESS';
export const REPORT_CREATE_FAIL = 'REPORT_CREATE_FAIL';

export const REPORT_LIST_REQUEST = 'REPORT_LIST_REQUEST';
export const REPORT_LIST_SUCCESS = 'REPORT_LIST_SUCCESS';
export const REPORT_LIST_FAIL = 'REPORT_LIST_FAIL';

export const REPORT_PENDING_REQUEST = 'REPORT_PENDING_REQUEST';
export const REPORT_PENDING_SUCCESS = 'REPORT_PENDING_SUCCESS';
export const REPORT_PENDING_FAIL = 'REPORT_PENDING_FAIL';

export const REPORT_REVIEW_REQUEST = 'REPORT_REVIEW_REQUEST';
export const REPORT_REVIEW_SUCCESS = 'REPORT_REVIEW_SUCCESS';
export const REPORT_REVIEW_FAIL = 'REPORT_REVIEW_FAIL';

export const REPORT_DISMISS_REQUEST = 'REPORT_DISMISS_REQUEST';
export const REPORT_DISMISS_SUCCESS = 'REPORT_DISMISS_SUCCESS';
export const REPORT_DISMISS_FAIL = 'REPORT_DISMISS_FAIL';

// Create a report
export const createReportAction = (reportData) => async (dispatch, getState) => {
    try {
        dispatch({ type: REPORT_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post('/api/reports', reportData, config);

        dispatch({
            type: REPORT_CREATE_SUCCESS,
            payload: data,
        });

        return data;
    } catch (error) {
        dispatch({
            type: REPORT_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Get pending reports (admin only)
export const getPendingReportsAction = () => async (dispatch, getState) => {
    try {
        dispatch({ type: REPORT_PENDING_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get('/api/reports/pending', config);

        dispatch({
            type: REPORT_PENDING_SUCCESS,
            payload: data.reports,
        });
    } catch (error) {
        dispatch({
            type: REPORT_PENDING_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Get all reports (admin only)
export const getAllReportsAction = () => async (dispatch, getState) => {
    try {
        dispatch({ type: REPORT_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get('/api/reports', config);

        dispatch({
            type: REPORT_LIST_SUCCESS,
            payload: data.reports,
        });
    } catch (error) {
        dispatch({
            type: REPORT_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Review report (admin only)
export const reviewReportAction = (reportId, actionTaken, deleteContent = false) => async (dispatch, getState) => {
    try {
        dispatch({ type: REPORT_REVIEW_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(
            `/api/reports/${reportId}/review`,
            { actionTaken, deleteContent },
            config
        );

        dispatch({
            type: REPORT_REVIEW_SUCCESS,
            payload: data,
        });

        return data;
    } catch (error) {
        dispatch({
            type: REPORT_REVIEW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Dismiss report (admin only)
export const dismissReportAction = (reportId) => async (dispatch, getState) => {
    try {
        dispatch({ type: REPORT_DISMISS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/reports/${reportId}/dismiss`, {}, config);

        dispatch({
            type: REPORT_DISMISS_SUCCESS,
            payload: data,
        });

        return data;
    } catch (error) {
        dispatch({
            type: REPORT_DISMISS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}; 