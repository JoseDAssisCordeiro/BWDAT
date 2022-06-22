package pt.ulisboa.tecnico.rnl.bwdat.bwdat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.BatteryManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.FragmentActivity;
import androidx.wear.ambient.AmbientModeSupport;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Timer;
import java.util.TimerTask;


public class MainActivity extends FragmentActivity implements AmbientModeSupport.AmbientCallbackProvider, View.OnClickListener, SensorEventListener, ActivityCompat.OnRequestPermissionsResultCallback {

    private TextView mTextView;
    private Button btn;

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private PowerManager.WakeLock mWakeLock;

    private String _gyroX = "0.0";
    private String _gyroY = "0.0";
    private String _gyroZ = "0.0";

    private String _heartR = "0.0";

    private String _accX = "0.0";
    private String _accY = "0.0";
    private String _accZ = "0.0";

    private static final int PERMISSION_REQUEST_READ_BODY_SENSORS = 1;

    final private String url = "https://bwdat.unifr.ch";

    private SensorManager mSensorManager;

    private SharedPreferences pref;
    private SharedPreferences.Editor editor;

    Intent batteryStatus;

    private int scale;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        pref = getApplicationContext().getSharedPreferences("MyPref", 0); // 0 - for private mode
        editor = pref.edit();
        editor.apply();

        batteryStatus = getApplicationContext().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        scale =  Objects.requireNonNull(batteryStatus).getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        if(ActivityCompat.checkSelfPermission(this, Manifest.permission.BODY_SENSORS)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.BODY_SENSORS},
                    PERMISSION_REQUEST_READ_BODY_SENSORS);
        }

        setContentView(R.layout.activity_main);
        AmbientModeSupport.AmbientController ambientController = AmbientModeSupport.attach(this);

        mTextView = findViewById(R.id.text);
        //Se nao tem id atribuido gera um atraves de http request
        if (pref.getString("device_id", null) == null) {
            addNewDevice();
        } else {
            mTextView.setText("BWDAT ID: " + pref.getString("device_id", "NA"));
        }

        btn = findViewById(R.id.button);
        btn.setOnClickListener(this);

        if(pref.getBoolean("is_button_checked", false))
            btn.setText(R.string.stop_button);

    }

    private void readValues(){

        mSensorManager = ((SensorManager) getSystemService(SENSOR_SERVICE));

        Sensor mGyroscopeSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
        mSensorManager.registerListener(this, mGyroscopeSensor, SensorManager.SENSOR_DELAY_NORMAL);

        Sensor mAccelerometerSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mSensorManager.registerListener(this, mAccelerometerSensor, SensorManager.SENSOR_DELAY_NORMAL);

        Sensor mHeartRateSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);
        mSensorManager.registerListener(this, mHeartRateSensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    private void addNewDevice(){
        BluetoothManager bluetoothManager = (BluetoothManager) this.getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothAdapter mBluetoothAdapter = bluetoothManager.getAdapter();
        if (mBluetoothAdapter != null && mBluetoothAdapter.isEnabled()) {
            boolean bluetoothOff = mBluetoothAdapter.disable();
            if(bluetoothOff)
                Toast.makeText(MainActivity.this, "Bluetooth was turned off", Toast.LENGTH_LONG).show();
        }

        ConnectivityManager cm =
                (ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE);
        Network activeNetwork = cm.getActiveNetwork();

        if(activeNetwork != null && cm.getNetworkCapabilities(activeNetwork).hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {

            // Instantiate the RequestQueue.
            RequestQueue queue = MySingleton.getInstance(this.getApplicationContext()).
                    getRequestQueue();


            // Request a string response from the provided URL.
            StringRequest stringRequest = new StringRequest(Request.Method.POST, url + "/CreateNewDevice",
                    new Response.Listener<String>() {
                        @SuppressLint("SetTextI18n")
                        @Override
                        public void onResponse(String response) {

                            editor.putString("device_id", response);
                            editor.apply();
                            mTextView.setText("BWDAT ID: " + response);
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Toast.makeText(MainActivity.this, error.toString(), Toast.LENGTH_LONG).show();
                        }
                    }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String> params = new HashMap<>();

                    Calendar cal = Calendar.getInstance();
                    params.put("date",sdf.format(cal.getTime()));

                    params.put("name", android.os.Build.DEVICE);
                    params.put("model", android.os.Build.MODEL);

                    return params;
                }

            };

            queue.add(stringRequest);

        }
        else{
            Toast.makeText(MainActivity.this, "No Wi-fi connection!", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {

        if (event.sensor.getType() == Sensor.TYPE_HEART_RATE) {
            _heartR = "" + (int) event.values[0];
        }
        if (event.sensor.getType() == Sensor.TYPE_GYROSCOPE) {

            final float RAD_TO_DEGREES = (float) (180.0f / Math.PI);

            _gyroX = "" + (int) event.values[0] * RAD_TO_DEGREES;
            _gyroY = "" + (int) event.values[1] * RAD_TO_DEGREES;
            _gyroZ = "" + (int) event.values[2] * RAD_TO_DEGREES;
        }
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            _accX = "" + event.values[0];
            _accY = "" + event.values[1];
            _accZ = "" + event.values[2];
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @SuppressLint({"SetTextI18n", "WakelockTimeout"})
    @Override
    public void onClick(View v) {

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BODY_SENSORS)
                == PackageManager.PERMISSION_GRANTED) {

            if (btn.getText().equals("Start!")) {

                BluetoothManager bluetoothManager = (BluetoothManager) this.getSystemService(Context.BLUETOOTH_SERVICE);
                BluetoothAdapter mBluetoothAdapter = bluetoothManager.getAdapter();
                if (mBluetoothAdapter != null && mBluetoothAdapter.isEnabled()) {
                    boolean bluetoothOff = mBluetoothAdapter.disable();
                    if(bluetoothOff)
                        Toast.makeText(MainActivity.this, "Bluetooth was turned off", Toast.LENGTH_LONG).show();
                }

                ConnectivityManager cm =
                        (ConnectivityManager)getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
                Network activeNetwork = cm.getActiveNetwork();

                if(activeNetwork != null && cm.getNetworkCapabilities(activeNetwork).hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {

                    btn.setText("Stop!");

                    editor.putBoolean("is_button_checked", true);
                    editor.apply();

                    editor.putInt("session", pref.getInt("session", 0) + 1);
                    editor.apply();

                    readValues();

                    PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
                    mWakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "app:myWakeLock");
                    mWakeLock.acquire();

                    new Timer().scheduleAtFixedRate(new TimerTask() {
                        @Override
                        public void run() {
                            Calendar cal = Calendar.getInstance();
                            sendMessage(sdf.format(cal.getTime()), _gyroX, _gyroY, _gyroZ, _accX, _accY, _accZ, _heartR);
                        }
                    }, 0, 1000);
                } else {
                    Toast.makeText(MainActivity.this, "No Wi-fi connection!", Toast.LENGTH_LONG).show();
                }
            } else {
                editor.putBoolean("is_button_checked", false);
                editor.apply();
                mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
                mSensorManager.unregisterListener(this);
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        mWakeLock.release();
                        System.exit(0);
                    }
                }, 500);
                this.finish();
            }
        }
        else{
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.BODY_SENSORS},
                    PERMISSION_REQUEST_READ_BODY_SENSORS);
        }
    }

    private void sendMessage(final String date, final String gyroX, final String gyroY, final String gyroZ, final String accX, final String accY, final String accZ, final String heartR) {

        // Instantiate the RequestQueue.
        RequestQueue queue = MySingleton.getInstance(this.getApplicationContext()).
                getRequestQueue();

        // Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.POST, url + "/BWDATWatch",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(MainActivity.this, "Connection failure", Toast.LENGTH_LONG).show();
                    }
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();

                batteryStatus = getApplicationContext().registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));

                params.put("battery", String.valueOf(batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) * 100 / scale));
                params.put("date", date);
                params.put("watch", "" + pref.getString("device_id", "0"));
                params.put("session", "" + pref.getInt("session", 0));
                params.put("gyro_x", gyroX);
                params.put("gyro_y", gyroY);
                params.put("gyro_z", gyroZ);
                params.put("acc_x", accX);
                params.put("acc_y", accY);
                params.put("acc_z", accZ);
                params.put("HR", heartR);

                return params;
            }

        };
        stringRequest.setRetryPolicy(new DefaultRetryPolicy(2000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(stringRequest);

    }
    private class MyAmbientCallback extends AmbientModeSupport.AmbientCallback {
        @Override
        public void onEnterAmbient(Bundle ambientDetails) {
            // Handle entering ambient mode
        }

        @Override
        public void onExitAmbient() {
            // Handle exiting ambient mode
        }

        @Override
        public void onUpdateAmbient() {
            // Update the content
        }
    }

    @Override
    public AmbientModeSupport.AmbientCallback getAmbientCallback() {
        return new MyAmbientCallback();
    }
}
