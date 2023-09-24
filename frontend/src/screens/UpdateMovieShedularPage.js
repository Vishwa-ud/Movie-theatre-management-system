import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Divider, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import axios from 'axios';
import Sidebar from '../components/sidebar/sidebar';
import AppHeader from '../components/hedder/Header';
import './common.css';
import movieSheduler from './movieSheduler.module.css';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Item } = Form;
const { Header, Content } = Layout;

function UpdateMovieShedularPage(props) {

    const navigate = useNavigate();
    let { sheduleId } = useParams();

    const screenWidth = window.innerHeight;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedShowTime, setSelectedShowTime] = useState(null);
    const [selectedMovie, setSelectMovie] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const [fieldsSelected, setFieldsSelected] = useState(false);
    const [previousMovieRedcord, setPreviousMoviesRecord] = useState({})
    const [AllMovieShedulers, setAllMovieShedulars] = useState([]);




    const movies = [
        { label: 'The Shawshank Redemption', value: 12345 },
        { label: 'The Godfather', value: 67890 },
        { label: 'The Dark Knight', value: 54321 },
        { label: 'Pulp Fiction', value: 98765 },
        { label: 'Schindler\'s List', value: 45678 },
        { label: 'Forrest Gump', value: 23456 },
        { label: 'The Lord of the Rings: The Return of the King', value: 78901 },
        { label: 'Inception', value: 34567 },
        { label: 'Fight Club', value: 87654 },
        { label: 'The Matrix', value: 32109 },
    ];


    const theaters = [
        { label: 'Theater A', value: 'Theater A' },
        { label: 'Theater B', value: 'Theater B' },
        { label: 'Theater C', value: 'Theater C' },
        { label: 'Theater D', value: 'Theater D' },
        { label: 'Theater E', value: 'Theater E' }
    ];






    const showtimes = [
        { label: '10:45 AM', value: '10:45 AM' },
        { label: '12:00 PM', value: '12:00 PM' },
        { label: '3:30 PM', value: '3:30 PM' },
    ];


    const [form] = Form.useForm();

    const onResetBtnClick = () => {
        form.resetFields();
        setFieldsSelected(false)
    };

    const onFinish = (values) => {
        // Prepare the data to send to the server
        const formData = {
            MovieName: selectedMovie.label, // Use the label of the selected movie
            MovieId: selectedMovie.value,   // Use the ID of the selected movie
            TheaterName: selectedCategory,
            StartDate: values.StartEndDate[0].format(dateFormat),
            EndDate: values.StartEndDate[1].format(dateFormat),
            ShowTime: selectedShowTime,
        };

        axios.put(`/admin/updateMovieShedularDetails/${sheduleId}`, formData)
            .then((res) => {
                if (res.data.status === 2100) {
                    Swal.fire(
                        selectedMovie.label + ' Updated!',
                        'Movie Schedule has been Updated.',
                        'success'
                    );
                    navigate('/sheduleMovie')

                }
            })
            .catch((error) => {
                console.error("Error", error);

                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Network Error',
                    showConfirmButton: false,
                    timer: 1500,
                    width: 10
                });
            });


        console.log("data", formData);
    };


    const getallMovieShedularDetails = () => {

        axios.get('/admin/getallMovieShedularDetails')
            .then((res) => {

                setAllMovieShedulars(res.data.data)
                const allMovieShedulars = res.data.data;
                const filteredMovie = allMovieShedulars.find(item => item._id === sheduleId);
                console.log("ssssss", filteredMovie)
                if (filteredMovie) {
                    // Now 'filteredMovie' contains the data object with the matching '_id'
                    // You can set the form fields with this data
                    // Parse the date strings to Date objects using dayjs
                    const startDate = dayjs(filteredMovie.StartDate);
                    const endDate = dayjs(filteredMovie.EndDate);

                    setSelectMovie({ label: filteredMovie.MovieName, value: filteredMovie.MovieId })
                    setSelectedCategory(filteredMovie.TheaterName)
                    setSelectedShowTime(filteredMovie.ShowTime,)

                    setFieldsSelected(true)
                    form.setFieldsValue({
                        MovieName: filteredMovie.MovieName,
                        MovieId: filteredMovie.MovieId,
                        Theater: filteredMovie.TheaterName,
                        StartEndDate: [startDate, endDate], // Use the parsed dates here
                        ShowTimes: filteredMovie.ShowTime,
                        // Set other form fields as needed
                    });
                }
            })
            .catch((error) => {
                console.error("Error", error);

                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Network Error',
                    showConfirmButton: false,
                    timer: 1500,
                    width: 10
                });
            });

    }


    const handleCalenderChange = (value) => {
        if (value && value.length === 2) {
            const startDate = new Date(value[0]);
            const endDate = new Date(value[1]);
            const daysArray = [];
            let currentDate = startDate;

            while (currentDate <= endDate) {
                daysArray.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            console.log("Selected days:", daysArray);

            // Check if any days in previousMovieRedcord date range are in daysArray
            if (
                previousMovieRedcord.StartDate &&
                previousMovieRedcord.EndDate
            ) {
                const previousStartDate = new Date(previousMovieRedcord.StartDate);
                const previousEndDate = new Date(previousMovieRedcord.EndDate);

                // Check if any day from previousMovieRedcord date range is in daysArray
                const overlappingDays = daysArray.filter((day) => {
                    const currentDate = new Date(day);
                    return (
                        currentDate >= previousStartDate &&
                        currentDate <= previousEndDate
                    );
                });

                if (overlappingDays.length > 0) {
                    // Show an alert because there are overlapping days
                    Swal.fire({
                        icon: 'warning',
                        title: 'Overlap Warning',
                        text: 'The selected date range overlaps with previous movie schedule!',
                    });
                    form.setFieldsValue({ StartEndDate: [] });
                }
            }
        } else {
            console.log("No date range selected");
        }
    };


    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        checkFieldsSelected();
    };

    const handleMovieChange = (value) => {
        const selectedMovie = movies.find(movie => movie.value === value);
        setSelectMovie(selectedMovie);
        checkFieldsSelected();
    };

    const handleShowTimeChange = (value) => {
        setSelectedShowTime(value);
        checkFieldsSelected();
    };

    const getMovieSheduleByTimeAndTheater = () => {

        const formData = {
            TheaterName: selectedCategory,
            ShowTime: selectedShowTime
        }

        axios.post('/admin/getMovieSheduleByTimeAndTheater', formData)
            .then((res) => {
                if (res.data.status === 2100) {
                    setPreviousMoviesRecord(res.data.data)

                }
            })
            .catch((error) => {
                console.error("Error", error);

                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Network Error',
                    showConfirmButton: false,
                    timer: 1500,
                    width: 10
                });
            });

    }


    const onDeleteSelectedItem = (record) => {
        console.log("record", record);
        // Confirm the deletion with a modal or use any other confirmation method you prefer
        Swal.fire({
            title: 'Delete Item',
            text: 'Are you sure you want to delete this item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Delete the item from the server using axios
                axios
                    .delete(`/admin/deleteMovieShedularDetails/${record._id}`)
                    .then((res) => {
                        if (res.data.status) {
                            // Remove the deleted item from the selected items list


                            // Optionally, you can also update the table data by fetching it again from the server
                            getallMovieShedularDetails();

                            // Show a success message
                            Swal.fire(
                                'Deleted!',
                                'The item has been deleted.',
                                'success'
                            );
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to delete the item.',
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Network Error',
                            text: 'Failed to delete the item.',
                        });
                    });
            }
        });
    };



    const columns = [
        {
            title: 'Film Name',
            dataIndex: 'MovieName',
            key: 'MovieName',
            width: '35%',

            ellipsis: true
        },
        {
            title: 'Theater',
            dataIndex: 'TheaterName',
            key: 'TheaterName',
            width: '20%',

            ellipsis: true
        },
        {
            title: 'Show Time',
            dataIndex: 'ShowTime',
            key: 'ShowTime',
            width: '25%',


            ellipsis: true
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            width: '20%',
            render: (_, record) => <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="primary"
                        icon={<EditFilled />}
                        size="default"
                        style={{
                            backgroundColor: '#f9f9f9',
                            color: 'var(--theme-color)',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            marginRight: '10px'
                        }}
                    />
                    <Button
                        onClick={() => onDeleteSelectedItem(record)}
                        type="danger"
                        icon={<DeleteFilled />}
                        size="default"
                        style={{
                            backgroundColor: '#f9f9f9',
                            color: 'var(--theme-color)',
                            border: '1px solid rgba(0, 0, 0, 0.23)',

                        }}
                    />
                </div>

            </div>,
        },

    ];

    useEffect(() => {
        setPreviousMoviesRecord({})
        checkFieldsSelected();
        getMovieSheduleByTimeAndTheater();
    }, [selectedCategory, selectedMovie, selectedShowTime]);

    const checkFieldsSelected = () => {
        // Check if all three fields are selected
        console.log(selectedCategory, selectedMovie, selectedShowTime)
        if (selectedCategory !== null && selectedMovie !== null && selectedShowTime !== null) {
            setFieldsSelected(true);
        } else {
            setFieldsSelected(false);
        }
    };

    useEffect(() => {

        getallMovieShedularDetails();
    }, []);

    return (
        <Layout>
            <Sidebar />
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
                <AppHeader />
                <div style={{
                    margin: '5px 16px',
                    overflow: 'initial',
                }}>
                    <Breadcrumb style={{ margin: '10px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Content
                                className="common-cotent-container"
                                style={{
                                    background: "white",
                                }}
                            >
                                <Divider orientation="left" orientationMargin="0">Add Schedule</Divider>
                                <Form
                                    form={form}
                                    onFinish={onFinish}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    layout="vertical"
                                >
                                    <Item
                                        label="Movie Name"
                                        name="MovieName"
                                        rules={[{ required: true, message: 'Please enter the company name' }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Search to Select"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={movies}
                                            onChange={handleMovieChange}
                                        />
                                    </Item>
                                    <Row gutter={16}>
                                        <Col lg={12} xs={24}>
                                            <Item
                                                label="Theater"
                                                name="Theater"
                                                rules={[{ required: true, message: 'Please select Theater' }]}
                                            >
                                                <Select options={theaters} onChange={handleCategoryChange} />
                                            </Item>
                                        </Col>
                                        <Col lg={12} xs={24}>
                                            <Item
                                                label="Show Times"
                                                name="ShowTimes"
                                                rules={[{ required: true, message: 'Please select show times' }]}
                                            >
                                                <Select options={showtimes} onChange={handleShowTimeChange} />
                                            </Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col lg={24} xs={24}>
                                            <Item
                                                label="Start Date - End Date"
                                                name="StartEndDate"
                                                rules={[
                                                    { required: true, message: 'Please select Start Date and End Date' },
                                                ]}
                                            >
                                                <RangePicker
                                                    style={{ width: "100%" }}
                                                    disabled={!fieldsSelected}
                                                    disabledDate={(current) => {
                                                        // Disable dates before the current date
                                                        const currentDate = dayjs().startOf('day');
                                                        if (current < currentDate) {
                                                            return true;
                                                        }
                                                        // Add another range of disabled dates
                                                        const disabledStartDate = dayjs(previousMovieRedcord.StartDate); // Replace with your desired start date
                                                        const disabledEndDate = dayjs(previousMovieRedcord.EndDate);   // Replace with your desired end date
                                                        return current >= disabledStartDate && current <= disabledEndDate;
                                                    }}
                                                    onChange={handleCalenderChange}
                                                    format={dateFormat}
                                                />
                                            </Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" htmlType="submit" className="common-save-btn common-btn-color" style={{ marginTop: '16px' }}>
                                                <span style={{ fontWeight: '600' }}>UPDATE</span>
                                            </Button>
                                            <Button type="default" onClick={onResetBtnClick} style={{
                                                marginLeft: '8px',
                                                backgroundColor: props.isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                                color: props.isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'
                                            }}>
                                                <span style={{ fontWeight: '700' }}>RESET</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Content>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Content
                                className="common-cotent-container"
                                style={{
                                    background: "white",
                                }}
                            >
                                <Divider orientation="left" orientationMargin="0">All Schedules</Divider>


                                <Table columns={columns} dataSource={AllMovieShedulers}

                                    pagination={{
                                        pageSize: 10,
                                    }}
                                    scroll={{
                                        y: screenWidth > 960 ? 600 : 300,
                                        x: screenWidth > 960 ? false : true
                                    }}

                                    className={`${movieSheduler.customtable}`} />

                            </Content>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </Layout>
    );
}

export default UpdateMovieShedularPage;
